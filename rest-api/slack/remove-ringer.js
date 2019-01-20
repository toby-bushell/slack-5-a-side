module.exports = class RingerList {
  constructor(db, body) {
    this.db = db;
    this.body = body;
  }

  async response(nextMatch, ringerName) {
    try {
      // 1) Lets grab the ringer that is to be removed from the next game
      const ringerToRemove = await this.getRinger(ringerName).catch(e => e);
      if (!ringerToRemove) return this.noMatchingRinger(ringerName);

      // 2) Check if ringer was not already added to match
      const ringerIsIn = nextMatch.players.some(
        playerAlreadyIn => playerAlreadyIn.id === ringerToRemove.id
      );
      if (!ringerIsIn)
        return this.ringerWasNotIn(
          nextMatch.players.length,
          ringerToRemove.name
        );

      // 3) Remover ringer to match
      const updatedMatch = await this.removeRinger(
        nextMatch,
        ringerToRemove
      ).catch(e => e);
      console.log('\x1b[31m', 'updated match', updatedMatch, '\x1b[0m');

      // 4) Return JSON
      return {
        text: `Ringer: *${ringerToRemove.name}* removed from upcoming game`,
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

  async removeRinger(nextMatch, player) {
    const id = nextMatch.id;
    const playerId = player.id;
    const where = { id: id };

    try {
      const UpdateMatch = await this.db.mutation.updateMatch(
        {
          data: {
            players: {
              disconnect: { id: playerId }
            }
          },
          where
        },
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
          text: 'Try the command `ringers` to get a list of possible ringers',
          mrkdwn_in: ['text', 'pretext']
        }
      ]
    };
  }

  ringerWasNotIn(playerCount, ringerName) {
    return {
      text: `The ringer *${ringerName}* was not playing`,
      attachments: [{ text: `Players playing: ${playerCount}` }]
    };
  }
};
