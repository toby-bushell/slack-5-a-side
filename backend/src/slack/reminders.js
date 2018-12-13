const { WebClient } = require('@slack/client');
const moment = require('moment');
// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = 'xoxb-18703011383-425949373157-pr8FbWDvwCX4LUojRBwmrhGV';
const web = new WebClient(token);
const Timeout = require('../utils/timeout.js');
const db = require('../db');

module.exports = class Reminders {
  async setup(match) {
    if (!match) throw 'no match set';
    console.log('\x1b[32m', 'match', match, '\x1b[0m');

    const { reminderTime, id } = match;
    // 1) work out timeout in seconds
    const timer = await this.getSecondsTillReminder(reminderTime);

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
    const playersToSend = await this.getPlayersToSend(match.players);
    console.log('\x1b[31m', 'players all ', playersToSend, '\x1b[0m');

    // 3) Send reminder to each player
    playersToSend.forEach(player => {
      this.sendMessage(player.slackId, match.id, formattedTime);
    });
  }

  async sendMessage(slackId, match) {
    try {
      // 1) Format time to display in message
      const { time } = match;
      const formattedTime = moment(time).format('Do MMMM');

      // 2) Send the reminder via slack
      const response = await web.chat.postMessage({
        channel: slackId,
        text: `Next match: *${formattedTime}*`,
        attachments: this.generateQuestion(match.id)
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getPlayersToSend(confirmedPlayers) {
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

    // Return players that are not already confirmed for the upcoming match
    return allPossible.filter(possible => {
      return confirmedPlayers.some(
        confirmedPlayer => confirmedPlayer.id !== possible.id
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
        `{id reminderTime players (orderBy:createdAt_DESC) { id name userType }}`
      )
      .catch(e => e);

    // 2) Store all reminder promises in an array
    const reminderArray = allPossible.map(async match => {
      const reminder = await this.setup(match);
      console.log('\x1b[32m', 'reminder', reminder, '\x1b[0m');

      return reminder;
    });

    // Trigger all reminders and await completion
    const reminders = await Promise.all(reminderArray);

    // Return once all reminders are set
    return reminders;
  }
};
