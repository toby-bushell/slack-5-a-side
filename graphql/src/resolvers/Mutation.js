const { WebClient } = require('@slack/client');
// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
require('dotenv').config({ path: 'variables.env' });
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);
const moment = require('moment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getBotChannel = require('../utils/get-bot-channel');
const axios = require('axios');
const { encrypt } = require('../encryption');

const Mutation = {
  async createPlayer(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }

    const player = await ctx.db.mutation.createPlayer(
      {
        data: { ...args }
      },
      info
    );

    return player;
  },
  async createRinger(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }

    const username = args.name;
    const player = await ctx.db.mutation.createPlayer(
      {
        data: { ...args, username, userType: 'RINGER', reminders: false }
      },
      info
    );

    return player;
  },
  async deletePlayer(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }

    const player = await ctx.db.mutation.deletePlayer({
      where: { id: args.id }
    });
    return player;
  },
  async createMatch(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }

    // 1) Get time of day the reminder should be set
    const adminOptions = await ctx.db.query.adminOptions({ first: 1 });
    const { reminderTime, reminderDay } = adminOptions[0];

    const reminderTimeArray = reminderTime.split(':');
    const hour = reminderTimeArray[0];
    const minute = reminderTimeArray[1];

    // 2) Get time of match
    const matchDate = args.time;

    // 3) Work out the day of the week to set the reminder
    let reminder;
    const matchDayOfWeek = moment(matchDate).weekday();
    if (reminderDay < matchDayOfWeek) {
      reminder = moment(matchDate)
        .weekday(reminderDay)
        .hour(hour)
        .minute(minute);
    } else {
      reminder = moment(matchDate)
        .subtract(1, 'weeks')
        .weekday(reminderDay)
        .hour(hour)
        .minute(minute);
    }

    // 4) Store
    const match = await ctx.db.mutation.createMatch(
      {
        data: { ...args, reminderTime: reminder }
      },
      info
    );

    // 5) Trigger reminder to start in rest api that will send to slack
    await axios
      .post(
        `${process.env.SLACK_API_URL}/set-reminders`,
        { match },
        {
          headers: {
            Authorization: encrypt(process.env.SLACK_TO_GRAPHQL_PASSWORD)
          }
        }
      )
      .catch(e => {
        throw new Error(e.message);
      });

    // 6) Return match
    return match;
  },
  async deleteMatch(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }

    const player = await ctx.db.mutation.deleteMatch({
      where: { id: args.id }
    });
    return player;
  },
  async addToMatch(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }

    const where = { id: args.id };
    const playerId = args.playerId;

    const match = await ctx.db.query.match(
      {
        where: { id: args.id }
      },
      '{ playersOut { id } }'
    );

    // If player had opted out before then also disconnect to players out
    const playerWasNotPlaying = match.playersOut.some(
      playerNotPlaying => playerNotPlaying.id === playerId
    );

    console.log('\x1b[32m', 'firing add to match', playerId, '\x1b[0m');

    console.log(
      '\x1b[32m',
      'playerWasNotPlaying',
      playerWasNotPlaying,
      '\x1b[0m'
    );

    const data = playerWasNotPlaying
      ? {
          data: {
            players: {
              connect: { id: playerId }
            },
            playersOut: {
              disconnect: { id: playerId }
            }
          }
        }
      : {
          data: {
            players: {
              connect: { id: playerId }
            }
          }
        };

    return ctx.db.mutation.updateMatch(
      {
        ...data,
        where
      },
      info
    );
  },

  async removeFromMatch(parent, args, ctx, info) {
    // if (!ctx.request.userId) {
    //   throw new Error('You must be logged in to do that!');
    // }

    console.log('\x1b[32m', 'remove', '\x1b[0m');

    const where = { id: args.id };
    const playerId = args.playerId;

    const match = await ctx.db.query.match(
      {
        where: { id: args.id }
      },
      '{ players { id } }'
    );
    console.log('\x1b[31m', 'match', match, '\x1b[0m');

    // If player had opted in before then also disconnect
    const playerWasPlaying = match.players.some(
      playerPlaying => playerPlaying.id === playerId
    );
    console.log('\x1b[32m', 'player was playing', playerWasPlaying, '\x1b[0m');

    const data = playerWasPlaying
      ? {
          data: {
            players: {
              disconnect: { id: playerId }
            },
            playersOut: {
              connect: { id: playerId }
            }
          }
        }
      : {
          data: {
            playersOut: {
              connect: { id: playerId }
            }
          }
        };

    return ctx.db.mutation.updateMatch(
      {
        ...data,
        where
      },
      info
    );
  },

  async saveSlackChannelMembers(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }

    // 1) First get all slack channels
    const botChannel = await getBotChannel().catch(e => e);

    // 3) Get the members list for that channel
    const channelInfo = await web.conversations.members({
      channel: botChannel.id
    });

    // 4) Only way to get enough info about each member is to query all users
    const allUsers = await web.users.list();

    // 5) Get only the users in the authenticated channel
    const membersInChannel = allUsers.members.filter(user =>
      channelInfo.members.includes(user.id)
    );
    // 6) Get rid of our bot user (or any others)
    const nonBotUsers = membersInChannel.filter(user => !user.is_bot);

    // 7) Get current users in DB
    const savedPlayers = await ctx.db.query.players();

    // 8) Create users that don't already exist
    const createNewUsers = async () => {
      const updatedIds = [];
      const promises = nonBotUsers.map(async user => {
        const userEmail = user.profile.email;
        const userExists = savedPlayers.some(player => {
          return player.email.toLowerCase() === userEmail.toLowerCase();
        });
        if (userExists) {
          console.log('user exists so skipping: ', user.name);
          return;
        }
        console.log('user being created', user);

        // Else lets create the user in db
        const dataToStore = {
          name: user.name,
          email: userEmail,
          username: user.name,
          reminders: true,
          image: user.profile.image_512,
          slackId: user.id,
          userType: 'MANIFESTO'
        };

        const playerStored = await ctx.db.mutation.createPlayer(
          {
            data: dataToStore
          },
          info
        );

        updatedIds.push(playerStored.id);
        return playerStored;
      });

      await Promise.all(promises);

      return updatedIds;
    };

    const createdUsersIds = await createNewUsers().catch(err => {
      throw new Error('error creating users', err);
    });

    // 10) Return a list of newly created users
    return await ctx.db.query.players({ where: { id_in: createdUsersIds } });
  },
  async setAdminOptions(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }

    console.log('args', args);

    // 1) We only ever set one adminOption so retrieve first
    const currentOptions = await ctx.db.query.adminOptions({ first: 1 });
    if (currentOptions.length === 0) {
      return ctx.db.mutation.createAdminOption({ data: { ...args } }, info);
    }

    // 2) If entry exists then we update
    const existingOptionsId = currentOptions[0].id;
    return ctx.db.mutation.updateAdminOption(
      {
        where: { id: existingOptionsId },
        data: { ...args }
      },
      info
    );
  },

  async signup(parent, args, ctx, info) {
    throw new Error('Disabled');
    // 1) lowercase their email
    args.email = args.email.toLowerCase();
    // 2) hash their password
    const password = await bcrypt.hash(args.password, 10);

    // 3) create the user in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] }
        }
      },
      info
    );
    // 4) create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 5) We set the jwt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    // 6) Finally we return the user to the browser
    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    // 1. check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. Check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid Password!');
    }
    // 3. generate the JWT Token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    console.log('\x1b[31m', 'token', token, '\x1b[0m');

    // 4. Set the cookie with the token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    // 5. Return the user
    return user;
  },

  async sendReminder(parent, { matchId, playerId }, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }

    try {
      // 1) Get the match
      const match = await ctx.db.query.match({
        where: { id: matchId }
      });
      console.log('\x1b[32m', 'match', match, '\x1b[0m');

      // 2) Get the player
      const player = await ctx.db.query.player({
        where: { id: playerId }
      });

      // 3) Lets trigger the reminder
      await axios
        .post(
          `${process.env.SLACK_API_URL}/send-reminder`,
          { player, match },
          {
            headers: {
              Authorization: encrypt(process.env.SLACK_TO_GRAPHQL_PASSWORD)
            }
          }
        )
        .catch(e => {
          throw new Error(e.message);
        });

      return 'Reminder sent';
    } catch (error) {
      return error;
    }
  },

  async updateUserType(parent, { id, type }, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }

    const player = await ctx.db.mutation.updatePlayer(
      {
        data: {
          userType: type
        },
        where: { id }
      },
      info
    );
    return player;
  },

  async playerPayment(parent, { playerId, amount }, ctx, info) {
    return ctx.db.mutation.updatePlayer(
      {
        data: {
          payments: {
            create: [{ time: moment(), amountPaid: amount }]
          }
        },
        where: { id: playerId }
      },
      info
    );
  },

  async deletePayment(parent, { playerId, transactionTime }, ctx, info) {
    return ctx.db.mutation.updatePlayer(
      {
        data: {
          payments: {
            deleteMany: {
              time: transactionTime
            }
          }
        },
        where: { id: playerId }
      },
      info
    );
  }
};

module.exports = Mutation;
