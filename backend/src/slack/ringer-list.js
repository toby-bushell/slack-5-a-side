module.exports = class RingerList {
  constructor(db, body) {
    this.db = db;
    this.body = body;
  }

  async response() {
    try {
      // 1) Get all ringers
      const ringers = await this.getRingers();

      // 2) Create ringer list
      const ringerList =
        ringers.length > 0
          ? `
        ${ringers.map((ringer, i) => `${i + 1}) ${ringer.name} \n`).join('')}`
          : 'No Ringers yet';

      // 3) Return JSON
      return {
        text: `*Ringers avaiable* (log into app to add more)`,
        attachments: [{ text: `${ringerList}` }]
      };
    } catch (e) {
      console.log('\x1b[31m', 'error', e, '\x1b[0m');
      return e;
    }
  }

  async getRingers() {
    const where = { userType: 'RINGER' };
    try {
      const UpdateMatch = await this.db.query.players(
        {
          where
        },
        '{  id name }'
      );
      return UpdateMatch;
    } catch (e) {
      throw e;
    }
  }
};
