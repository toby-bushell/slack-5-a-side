import { Request, Response } from 'express';
import AuthenticateSlack from './authenticate';
import { BalanceSlash } from './balance-slash';
import { ErrorMessages } from './error-messages';
import { HelpSlash } from './help-slash';
import { InSlash } from './in-slash';
import { InfoSlash } from './info-slash';
import { OutSlash } from './out-slash';
import { Reminders } from './reminders';
require('dotenv').config({ path: 'variables.env' });

import express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const endpoint = process.env.GRAPHQL_ENDPOINT;
const app = express();
const server = require('http').createServer(app);

const { GraphQLClient } = require('graphql-request');
const { encrypt, decrypt } = require('./encryption');

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: encrypt(process.env.SLACK_TO_GRAPHQL_PASSWORD)
  }
});

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

app.post('/send-reminder', async (req: Request, res: Response) => {
  const auth = req.headers.authorization;

  // If auth headers sent
  if (!auth || decrypt(auth) !== process.env.SLACK_TO_GRAPHQL_PASSWORD) {
    return res.json('Not authenticated');
  }
  const { player, match } = req.body;
  if (!player || !match)
    return res.json('need to provide a player and a match');

  const reminders = new Reminders(graphQLClient);
  try {
    reminders.sendMessage(player.slackId, match);
  } catch (e) {
    throw e;
  }
  return res.json('Message sent');
});

// app.post('/set-reminders', async (req, res) => {
//   // If auth headers sent
//   if (!auth || decrypt(auth) !== process.env.SLACK_TO_GRAPHQL_SECRET) {
//     return res.json('Not authenticated');
//   }
//   const { matchId } = req.body;
//   if (!matchId) return res.json('need a matchId');

//   const Reminders = new reminders(graphQLClient);
//   try {
//     Reminders.setup(match);
//   } catch (e) {
//     throw e;
//   }
//   return res.json('Reminder set up');
// });

app.use(AuthenticateSlack);

/**
 * Handle slash commands
 */
app.post('/slash', async (req: Request, res: Response) => {
  const { body } = req;
  const { text } = body;

  console.log('\x1b[31m', 'req.body', req.body, '\x1b[0m');

  // Get player from slack id
  const playersQuery = `{
    players(where: {slackId: "${body.user_id}" }) {
      id
      name
      slackId
      payments {
        time
        amountPaid
      }
      matchesPlayed {
        time
      }
    }
  }`;

  const playerResponse = await graphQLClient
    .request(playersQuery)
    .catch((e: Error) => res.json(e.message));

  console.log('\x1b[32m', 'playerResponse', playerResponse, '\x1b[0m');
  const player = playerResponse.players[0];

  // If no player in DB return
  if (!player) return res.json(ErrorMessages.noPlayerInDb);

  // Get next scheduled match
  const matchesQuery = `{
    nextMatch {
      id
      time
      players(orderBy: createdAt_DESC) {
        id
        name
        userType
      }
       playersOut{
         id 
         name 
         userType
      }
    }
  }`;
  const nextMatchResponse = await graphQLClient
    .request(matchesQuery)
    .catch((e: Error) => res.json(e.message));
  const nextMatch = nextMatchResponse.nextMatch[0];
  // If no match return
  if (!nextMatch) return res.json(ErrorMessages.noMatchSet);

  let messageToRespond;
  const helpSlash = new HelpSlash();
  // Handle each specific slash command
  switch (text) {
    case 'in':
      const inSlash = new InSlash(graphQLClient);
      messageToRespond = await inSlash.response(nextMatch, player);
      break;
    case 'info':
      const infoSlash = new InfoSlash(graphQLClient);
      messageToRespond = await infoSlash.response(nextMatch);
      break;
    case 'out':
      const outSlash = new OutSlash(graphQLClient);
      messageToRespond = await outSlash.response(nextMatch, player);
      break;
    case 'balance':
      const balanceSlash = new BalanceSlash(graphQLClient);
      messageToRespond = await balanceSlash.response(player);
      console.log('messageToRespond', messageToRespond);

      break;
    case 'help':
      messageToRespond = await helpSlash.response();
      break;

    default:
      // if (text.includes('add-ringer')) {
      //   const addRinger = new AddRinger(db);
      //   messageToRespond = await addRinger.response(
      //     nextMatch,
      //     text.replace('add-ringer', '').trim()
      //   );
      // } else if (text.includes('remove-ringer')) {
      //   const removeRinger = new RemoveRinger(db);
      //   messageToRespond = await removeRinger.response(
      //     nextMatch,
      //     text.replace('remove-ringer', '').trim()
      //   );
      // }
      messageToRespond = await helpSlash.response(
        ":interrobang: Oops, we don't recognise that command, did you mean :point_down:"
      );

      break;
  }
  res.json(messageToRespond);
});

/**
 * Receives button message response from slack
 */
app.post('/interactive', async (req: Request, res: Response) => {
  console.log('\x1b[31m', 'interactive firing at least', '\x1b[0m');

  // 1) Grab the action values
  const parsed = JSON.parse(req.body.payload);
  const actionValue = parsed.actions[0].value;

  // 2) Grab the callback_id which is the match id
  const { callback_id } = parsed;

  // 3) Get the match
  const matchesQuery = `{
    matches(where: {id: "${callback_id}"}) {
      id
      time
      players(orderBy: createdAt_DESC) {
        id
        name
        userType
      }
       playersOut{
         id 
         name 
         userType
      }
    }
  }`;
  const nextMatchResponse = await graphQLClient
    .request(matchesQuery)
    .catch((e: Error) => res.json(e.message));

  console.log('\x1b[32m', 'nextMatchResponse', nextMatchResponse, '\x1b[0m');

  const nextMatch = nextMatchResponse.matches[0];

  // 4) Get the player from slack id
  const playersQuery = `{
    players(where: {slackId: "${parsed.user.id}"}) {
      id
      name
      slackId
      username
      reminders
    }
  }`;
  const playersQueryResponse = await graphQLClient
    .request(playersQuery)
    .catch((e: Error) => res.json(e.message));
  const player = playersQueryResponse.players[0];

  let messageToRespond;
  if (actionValue === 'in') {
    const inSlash = new InSlash(graphQLClient);
    messageToRespond = await inSlash.response(nextMatch, player);
  } else if (actionValue === 'out') {
    const outSlash = new OutSlash(graphQLClient);
    messageToRespond = await outSlash.response(nextMatch, player);
  } else {
    messageToRespond = {
      text: `Ooops something went wrong`
    };
  }

  return res.json(messageToRespond);
});

const port = process.env.PORT || 3002;

server.listen(port, async () => {
  console.log(`Find the server at: http://localhost:${port}/`); // eslint-disable-line no-console
  const reminders = new Reminders(graphQLClient);
  reminders.setAllReminders();
});
