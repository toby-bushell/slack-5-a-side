const { WebClient } = require('@slack/client');
// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
require('dotenv').config({ path: 'variables.env' });
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

const Query = {
  players(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }
    return ctx.db.query.players(args, info);
  },
  matches(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }
    return ctx.db.query.matches(args, info);
  },
  match(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }
    return ctx.db.query.match(args, info);
  },
  adminOptions(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }
    return ctx.db.query.adminOptions(args, info);
  },
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
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }
    const currentDate = new Date();
    const nextMatch = await ctx.db.query.matches(
      {
        where: { time_gt: currentDate },
        orderBy: 'time_ASC',
        first: 1
      },
      info
    );

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
