"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var qs = require('qs');
var crypto = require('crypto');
function default_1(req, res, next) {
    var timestamp = req.headers['x-slack-request-timestamp'];
    var slackSig = req.headers['x-slack-signature'];
    var timeNow = Math.round(new Date().getTime() / 1000);
    var differenceInTime = timeNow - timestamp;
    // If request was greater than five mins ago return
    if (differenceInTime > 60 * 5) {
        return res.status(500).send('Request was over 5 minutes ago!');
    }
    var reqBodyString = qs.stringify(req.body, { format: 'RFC1738' });
    var sigBasestring = "v0:" + timestamp + ":" + reqBodyString;
    // Create the hash
    var computedSig = "v0=" + crypto
        .createHmac('sha256', process.env.SLACK_SIGNING_SECRET)
        .update(sigBasestring, 'utf8')
        .digest('hex');
    if (crypto.timingSafeEqual(Buffer.from(computedSig, 'utf8'), Buffer.from(slackSig, 'utf8'))) {
        console.log('\x1b[32m', 'authenticated request', '\x1b[0m');
        next();
    }
    else {
        console.log('error');
        return res.status(400).send('Verification failed');
    }
}
exports.default = default_1;
//# sourceMappingURL=authenticate.js.map