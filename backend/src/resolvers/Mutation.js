const { WebClient } = require('@slack/client');
// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = 'xoxb-18703011383-425949373157-pr8FbWDvwCX4LUojRBwmrhGV';
const web = new WebClient(token);
const moment = require('moment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const reminders = require('../slack/reminders');

const Mutation = {
  async createPlayer(parent, args, ctx, info) {
    const player = await ctx.db.mutation.createPlayer(
      {
        data: { ...args }
      },
      info
    );

    return player;
  },
  async createRinger(parent, args, ctx, info) {
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
    const player = await ctx.db.mutation.deletePlayer({
      where: { id: args.id }
    });
    return player;
  },
  async createMatch(parent, args, ctx, info) {
    // 1) Get time of day the reminder should be set
    const adminOptions = await ctx.db.query.adminOptions({ first: 1 });
    const { reminderTime } = adminOptions[0];
    console.log('\x1b[31m', 'admin options', adminOptions, '\x1b[0m');

    const reminderTimeArray = reminderTime.split(':');
    const hour = reminderTimeArray[0];
    const minute = reminderTimeArray[1];

    // 2) Get time of match
    const matchDate = args.time;

    // 3) Work out the reminder time based on admin set time of day
    const reminder = moment(matchDate)
      .subtract(1, 'day')
      .hour(hour)
      .minute(minute);

    // 4) Store
    const match = await ctx.db.mutation.createMatch(
      {
        data: { ...args, reminderTime: reminder }
      },
      info
    );

    // 5) Trigger reminder to start in rest api that will send to slack

    return match;
  },
  async deleteMatch(parent, args, ctx, info) {
    const player = await ctx.db.mutation.deleteMatch({
      where: { id: args.id }
    });
    return player;
  },
  async addToMatch(parent, args, ctx, info) {
    const where = { id: args.id };
    const playerId = args.playerId;

    return ctx.db.mutation.updateMatch(
      {
        data: {
          players: {
            connect: { id: playerId }
          }
        },
        where
      },
      info
    );
  },

  async removeFromMatch(parent, args, ctx, info) {
    console.log('\x1b[32m', 'args', args, '\x1b[0m');

    const where = { id: args.id };
    const playerId = args.playerId;

    return ctx.db.mutation.updateMatch(
      {
        data: {
          players: {
            disconnect: { id: playerId }
          }
        },
        where
      },
      info
    );
  },

  async saveSlackChannelMembers(parent, args, ctx, info) {
    // First get all slack channels
    const channelsInfo = await web.conversations.list();

    // Lets get the chanel that the bot is added to
    const channel = channelsInfo.channels.find(channel => {
      return channel.is_member;
    });

    if (!channel)
      throw new Error('There is no authenticated chanel for this slack app');

    // Get the members list for that channel
    const channelInfo = await web.conversations.members({
      channel: channel.id
    });

    // Only way to get enough info about each member is to query all users
    const allUsers = await web.users.list();

    // Get only the users in the authenticated channel
    const membersInChannel = allUsers.members.filter(user =>
      channelInfo.members.includes(user.id)
    );
    // Get rid of our bot user (or any others)
    const nonBotUsers = membersInChannel.filter(user => !user.is_bot);

    // Get current users in DB
    const savedPlayers = await ctx.db.query.players();

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

    // Return a list of newly created users
    return await ctx.db.query.players({ where: { id_in: createdUsersIds } });
  },
  async setAdminOptions(parent, args, ctx, info) {
    // We only ever set one adminOption
    const currentOptions = await ctx.db.query.adminOptions({ first: 1 });
    if (currentOptions.length === 0) {
      return ctx.db.mutation.createAdminOption({ data: { ...args } }, info);
    }

    // If entry exists then we update
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
    // lowercase their email
    args.email = args.email.toLowerCase();
    // hash their password
    const password = await bcrypt.hash(args.password, 10);

    // create the user in the database
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
    // create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // We set the jwt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    // Finally we return the user to the browser
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
      const { slackId } = player;

      // 3) Lets trigger the reminder
      const Reminders = new reminders();
      const response = await Reminders.sendMessage(slackId, match);
      return 'Reminder sent';
    } catch (error) {
      return error;
    }
  }
};

module.exports = Mutation;
