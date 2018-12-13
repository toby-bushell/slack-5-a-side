module.exports = class RingerList {
  constructor(db, body) {
    this.db = db;
    this.body = body;
  }

  async response(nextMatch, ringerName) {
    try {
      // 1) Lets grab the ringer that is to be added to the next game
      const ringerToAdd = await this.getRinger(ringerName).catch(e => e);
      if (!ringerToAdd) return this.noMatchingRinger(ringerName);

      // 2) Check if ringer is already in match
      const ringerIsIn = nextMatch.players.some(
        playerAlreadyIn => playerAlreadyIn.id === ringerToAdd.id
      );
      if (ringerIsIn)
        return this.ringerAlreadyIn(nextMatch.players.length, ringerToAdd.name);

      // 3) Add ringer to match
      const updatedMatch = await this.addRinger(nextMatch, ringerToAdd).catch(
        e => e
      );
      console.log('\x1b[31m', 'updated match', updatedMatch, '\x1b[0m');

      // 4) Return JSON
      return {
        text: `Ringer: *${ringerToAdd.name}* Added to upcoming game`,
        attachments: [
          { text: `Players so far: ${updatedMatch.players.length}` }
        ]
      };
    } catch (e) {
      console.log('\x1b[31m', 'error', e, '\x1b[0m');
      return e;
    }
  }

  async getRinger(ringerName) {
    const where = { userType: 'RINGER', name: ringerName };
    try {
      const UpdateMatch = await this.db.query.players(
        {
          where
        },
        '{  id name }'
      );
      console.log('UpdateMatch', UpdateMatch);

      return UpdateMatch[0]; // Should only ever be one TODO: make sure ringer names are unique in creation
    } catch (e) {
      throw e;
    }
  }

  async addRinger(nextMatch, player) {
    const id = nextMatch.id;
    const playerId = player.id;
    const where = { id: id };

    try {
      const UpdateMatch = await this.db.mutation.updateMatch(
        { data: { players: { connect: { id: playerId } } }, where },
        '{ id time players { id name }}'
      );
      return UpdateMatch;
    } catch (e) {
      throw e;
    }
  }

  noMatchingRinger(ringerName) {
    return {
      text: `No matching ringer for *${ringerName}*`,
      attachments: [
        {
          text:
            'Try the command `ringers` to get a list of possible ringers to add',
          mrkdwn_in: ['text', 'pretext']
        }
      ]
    };
  }

  ringerAlreadyIn(playerCount, ringerName) {
    return {
      text: `The ringer *${ringerName}* is already playing`,
      attachments: [
        {
          text: `Players so far: ${playerCount}`
        }
      ]
    };
  }
};
