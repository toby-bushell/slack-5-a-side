const qs = require('qs');
const crypto = require('crypto');

module.exports = function(req, res, next) {
  const {
    'x-slack-request-timestamp': timestamp,
    'x-slack-signature': slackSig
  } = req.headers;
  const timeNow = Math.round(new Date().getTime() / 1000);
  const differenceInTime = timeNow - timestamp;
  // If request was greater than five mins ago return
  if (differenceInTime > 60 * 5) {
    return res.status(500).send('Request was over 5 minutes ago!');
  }
  let reqBodyString = qs.stringify(req.body, { format: 'RFC1738' });

  const sigBasestring = `v0:${timestamp}:${reqBodyString}`;

  // Create the hash
  const computedSig = `v0=${crypto
    .createHmac('sha256', process.env.SLACK_SIGNING_SECRET)
    .update(sigBasestring, 'utf8')
    .digest('hex')}`;

  if (
    crypto.timingSafeEqual(
      Buffer.from(computedSig, 'utf8'),
      Buffer.from(slackSig, 'utf8')
    )
  ) {
    console.log('\x1b[32m', 'authenticated request', '\x1b[0m');

    next();
  } else {
    console.log('error');

    return res.status(400).send('Verification failed');
  }
};
