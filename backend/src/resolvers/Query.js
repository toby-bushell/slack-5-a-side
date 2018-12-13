const { WebClient } = require('@slack/client');
// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = 'xoxb-18703011383-425949373157-pr8FbWDvwCX4LUojRBwmrhGV';
const web = new WebClient(token);

const { forwardTo } = require('prisma-binding');
const reminders = require('../slack/reminders');
const Reminders = new reminders();

const Query = {
  players: forwardTo('db'),
  matches: forwardTo('db'),
  match: forwardTo('db'),
  adminOptions: forwardTo('db'),
  me(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
  },
  async nextMatch(parent, args, ctx, info) {
    const currentDate = new Date();
    const nextMatch = await ctx.db.query.matches(
      {
        where: { time_gt: currentDate },
        orderBy: 'time_ASC',
        first: 1
      },
      info
    );

    Reminders.setup(nextMatch[0]);
    return nextMatch;
  },
  async channels(parent, args, ctx, info) {
    // First get all slack channels
    const channelsInfo = await web.conversations.list();
    console.log('channelsInfo', channelsInfo);

    const check = await ctx.db.query.matches();
    console.log('\x1b[31m', 'check', check, '\x1b[0m');
    return channelsInfo.channels;
  }
};

module.exports = Query;
