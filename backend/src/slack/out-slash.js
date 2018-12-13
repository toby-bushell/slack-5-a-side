module.exports = class OutSlash {
  constructor(db, body) {
    this.db = db;
    this.body = body;
  }

  async response(nextMatch, player) {
    console.log('\x1b[32m', 'response firing', '\x1b[0m');

    try {
      // If they were not playing then don't update
      const playerIsIn = nextMatch.players.some(
        playerAlreadyIn => playerAlreadyIn.id === player.id
      );
      if (!playerIsIn) {
        return this.playerWasNotIn(nextMatch.players.length);
      }

      const updatedMatch = await this.removeFromMatch(nextMatch, player);
      const playersInMatch = updatedMatch.players;
      const playerCount = playersInMatch.length;

      return this.playerIsOut(playerCount);
    } catch (e) {
      console.log('\x1b[31m', 'error occured', e, '\x1b[0m');
    }
  }

  playerIsOut(playerCount) {
    return {
      text: `You're out... BOO!`,
      attachments: [
        {
          text: `Players playing: ${playerCount}`
        }
      ]
    };
  }

  playerWasNotIn(playerCount) {
    return {
      text: `You were not playing!`,
      attachments: [{ text: `Players playing: ${playerCount}` }]
    };
  }

  async removeFromMatch(nextMatch, player) {
    const where = { id: nextMatch.id };
    const playerId = player.id;

    return this.db.mutation.updateMatch(
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
  }
};
