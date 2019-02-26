require('dotenv').config({ path: 'variables.env' });
import * as crypto from 'crypto';
const algorithm = 'aes-256-ctr';
const password = process.env.SLACK_TO_GRAPHQL_SECRET;

export const encrypt = (text: string) => {
  console.log('\x1b[32m', 'encrypting', '\x1b[0m');

  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};
export const decrypt = (text: string) => {
  console.log('\x1b[32m', 'decrypting', '\x1b[0m');

  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

module.exports = { encrypt, decrypt };
