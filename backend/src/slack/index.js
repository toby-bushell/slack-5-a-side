const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { WebClient } = require('@slack/client');
const moment = require('moment');
// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = 'xoxb-18703011383-425949373157-pr8FbWDvwCX4LUojRBwmrhGV';
const web = new WebClient(token);

const app = express();
const server = require('http').createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(helmet());

const db = require('../db');
const InSlash = require('./in-slash');
const RingerList = require('./ringer-list');
const AddRinger = require('./add-ringer');
const RemoveRinger = require('./remove-ringer');
const InfoSlash = require('./info-slash');
const OutSlash = require('./out-slash');
const ErrorMessages = require('./error-messages');
const reminders = require('./reminders');

/**
 * Handle slash commands
 */
app.post('/slack/slash', async (req, res) => {
  const { body } = req;
  const { text } = body;

  // Get player from slack id
  const playerResponse = await db.query
    .players({ where: { slackId: [body.user_id] } })
    .catch(err => res.json(err));
  const player = playerResponse[0];
  // If no player in DB return
  if (!player) return res.json(ErrorMessages.noPlayerInDb);

  // Get next scheduled match
  const nextMatchResponse = await db.query
    .matches(
      {
        where: { time_gt: new Date().setHours(0, 0, 0, 0) },
        orderBy: 'time_ASC',
        first: 1
      },
      '{ id time players (orderBy:createdAt_DESC) { id name userType }}'
    )
    .catch(err => res.json(err));
  const nextMatch = nextMatchResponse[0];
  // If no match return
  if (!nextMatch) return res.json(ErrorMessages.noMatchSet);

  let messageToRespond;
  // Handle each specific slash command
  switch (text) {
    case 'in':
      const inSlash = new InSlash(db);
      messageToRespond = await inSlash.response(nextMatch, player);
      break;
    case 'info':
      const infoSlash = new InfoSlash(db);
      messageToRespond = await infoSlash.response(nextMatch);
      break;
    case 'ringers':
      const ringerList = new RingerList(db);
      messageToRespond = await ringerList.response();
      break;
    case 'out':
      const outSlash = new OutSlash(db);
      messageToRespond = await outSlash.response(nextMatch, player);
      break;
    default:
      if (text.includes('add-ringer')) {
        const addRinger = new AddRinger(db);
        messageToRespond = await addRinger.response(
          nextMatch,
          text.replace('add-ringer', '').trim()
        );
      } else if (text.includes('remove-ringer')) {
        const removeRinger = new RemoveRinger(db);
        messageToRespond = await removeRinger.response(
          nextMatch,
          text.replace('remove-ringer', '').trim()
        );
      }

      break;
  }
  res.json(messageToRespond);
});

/**
 * Receives button message response from slack
 */
app.post('/slack/interactive', async (req, res) => {
  // 1) Grab the action values
  const parsed = JSON.parse(req.body.payload);
  const actionValue = parsed.actions[0].value;
  console.log('parsed?', parsed);

  // 2) Grab the callback_id which is the match id
  const { callback_id } = parsed;

  // 3) Get the match
  console.log('\x1b[31m', 'callback_id', callback_id, '\x1b[0m');

  const nextMatch = await db.query.match(
    { where: { id: callback_id } },
    '{ id time players (orderBy:createdAt_DESC) { id name userType }}'
  );

  console.log('\x1b[34m', 'nextmatch', nextMatch, '\x1b[0m');

  // 4) Get the player from slack id
  const playerResponse = await db.query
    .players({ where: { slackId: [parsed.user.id] } })
    .catch(err => res.json(err));
  const player = playerResponse[0];

  let messageToRespond;
  if (actionValue === 'in') {
    const inSlash = new InSlash(db);
    messageToRespond = await inSlash.response(nextMatch, player);
    res.json(messageToRespond);
  } else if (actionValue === 'out') {
    const outSlash = new OutSlash(db);
    messageToRespond = await outSlash.response(nextMatch, player);
  } else {
    messageToRespond = {
      text: `Ooops something went wrong`
    };
  }

  return res.json(messageToRespond);
});

server.listen(3001, async () => {
  console.log(`Find the server at: http://localhost:3001/`); // eslint-disable-line no-console
  const Reminders = new reminders(db);
  Reminders.setAllReminders();
});
