require('dotenv').config({ path: 'variables.env' });
import { WebClient } from '@slack/client';
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

const getBotChannel = async () => {
  // 1) First get all slack channels
  try {
    const channelsInfo: any = await web.conversations.list(); // https://github.com/slackapi/node-slack-sdk/issues/581
    console.log('\x1b[32m', 'channelsInfo', channelsInfo, '\x1b[0m');

    // 2) Lets get the chanel that the bot is added to
    const channel = channelsInfo.channels.find((channel: any) => {
      return channel.is_member;
    });

    if (!channel)
      throw new Error('There is no authenticated chanel for this slack app');

    return channel;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = getBotChannel;
