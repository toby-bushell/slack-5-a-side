module.exports = class OutSlash {
  constructor(db, body) {
    this.db = db;
    this.body = body;
  }

  async response(nextMatch, player) {
    try {
      // If they were not playing then don't update
      const playerIsOut = nextMatch.playersOut.some(
        playerAlreadyOut => playerAlreadyOut.id === player.id
      );
      if (playerIsOut) {
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
      text: `:thumbsdown: You're out... BOO!`,
      attachments: [
        { text: `Players so far: *${playerCount}*`, mrkdwn_in: ['text'] }
      ]
    };
  }

  playerWasNotIn(playerCount) {
    return {
      text: `:thumbsdown: You were already not playing!`,
      attachments: [
        { text: `Players so far: *${playerCount}*`, mrkdwn_in: ['text'] }
      ]
    };
  }

  async removeFromMatch(nextMatch, player) {
    const where = { id: nextMatch.id };
    const playerId = player.id;

    // If player had opted in before then also disconnect
    const playerWasPlaying = nextMatch.players.some(
      playerPlaying => playerPlaying.id === player.id
    );
    console.log('\x1b[32m', 'player was playing', playerWasPlaying, '\x1b[0m');

    const data = playerWasPlaying
      ? {
          data: {
            players: {
              disconnect: { id: playerId }
            },
            playersOut: {
              connect: { id: playerId }
            }
          }
        }
      : {
          data: {
            playersOut: {
              connect: { id: playerId }
            }
          }
        };

    return this.db.mutation.updateMatch(
      {
        data,
        where
      },
      '{ id time players { id name }}'
    );
  }
};
