const { WebClient } = require('@slack/client');
const moment = require('moment');
require('dotenv').config({ path: 'variables.env' });
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);
const Timeout = require('../utils/timeout.js');
const db = require('../db');

module.exports = class Reminders {
  async setup(match) {
    if (!match) throw 'no match set';
    console.log('\x1b[32m', 'setup match', match, '\x1b[0m');

    const { reminderTime, id } = match;

    // 1) work out timeout in seconds
    const timer = await this.getSecondsTillReminder(reminderTime);
    console.log('\x1b[31m', 'timer', timer, reminderTime, '\x1b[0m');

    if (timer < 0) return;

    // 2) create and set timeout with the matchId as the key
    const quickTimer = 2000;
    await Timeout.set(id, () => this.sendReminder(match), timer);

    // 3) Just return
    return true;
  }

  async getSecondsTillReminder(reminderTime) {
    return moment(reminderTime).diff(moment());
  }

  async sendReminder(match) {
    if (!match) throw 'No match id';

    // 2) Get list of players to send reminders to - in channel and not yet in for next match
    const playersToSend = await this.getPlayersToSend(
      match.players,
      match.playersOut
    );

    console.log('\x1b[31m', 'players to send', playersToSend, '\x1b[0m');

    // 3) Send reminder to each player
    return playersToSend.forEach(player => {
      this.sendMessage(player.slackId, match);
    });
  }

  async sendMessage(playerSlackId, match) {
    try {
      // 1) Format time to display in message
      const { time } = match;
      const formattedTime = moment(time).format('Do MMMM');

      // 2) Send the reminder via slack
      const response = await web.chat.postMessage({
        channel: playerSlackId,
        text: `Next match: *${formattedTime}*`,
        attachments: this.generateQuestion(match.id)
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getPlayersToSend(confirmedPlayers, playersOut) {
    const allPossible = await db.query
      .players(
        {
          where: {
            userType: 'MANIFESTO'
          }
        },
        `{id name slackId}`
      )
      .catch(e => e);

    // Combine all players in and players out as we don't want to send reminders to either
    const playersToNotSend = [...confirmedPlayers, ...playersOut];

    // console.log('playersToNotSend', playersToNotSend);
    // console.log('allPossible', allPossible);

    // Return players that are not already confirmed for the upcoming match
    return allPossible.filter(possible => {
      return (
        playersToNotSend.length === 0 ||
        playersToNotSend.some(
          playerToNotSend => playerToNotSend.id !== possible.id
        )
      );
    });
  }

  generateQuestion(matchId) {
    return [
      {
        text: 'Are you playing?',
        fallback: 'You can\t see butons',
        callback_id: `${matchId}`,
        color: '#e50056',
        attachment_type: 'default',
        actions: [
          {
            name: 'playing',
            text: "I'm In",
            type: 'button',
            value: 'in'
          },
          {
            name: 'playing',
            text: 'Out',
            type: 'button',
            value: 'out'
          }
        ]
      }
    ];
  }

  async setAllReminders() {
    // 1) get all future matches
    const allPossible = await db.query
      .matches(
        { where: { time_gt: new Date() } },
        '{ id time reminderTime playersOut { id name userType } players (orderBy:createdAt_DESC) { id name userType }}'
      )
      .catch(e => e);

    console.log('\x1b[31m', 'allPossible', allPossible, '\x1b[0m');

    // 2) Store all reminder promises in an array
    const reminderArray = allPossible.map(async match => {
      const reminder = await this.setup(match);
      return reminder;
    });

    // Trigger all reminders and await completion
    const reminders = await Promise.all(reminderArray);

    // Return once all reminders are set
    return reminders;
  }
};
