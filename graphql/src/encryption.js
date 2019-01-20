require('dotenv').config({ path: 'variables.env' });
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const password = process.env.SLACK_TO_GRAPHQL_SECRET;

function encrypt(text) {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}
function decrypt(text) {
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

module.exports = { encrypt, decrypt };
