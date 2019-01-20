module.exports = class InSlash {
  constructor(db, body) {
    this.db = db;
    this.body = body;
  }

  async response(nextMatch, player) {
    try {
      // If already playing don't bother adding
      const playerIsIn = nextMatch.players.some(
        playerAlreadyIn => playerAlreadyIn.id === player.id
      );
      if (playerIsIn) return this.playerAlreadyIn(nextMatch.players.length);

      const updatedMatch = await this.addToMatch(nextMatch, player);
      const playersInMatch = updatedMatch.players;
      const playerCount = playersInMatch.length;

      console.log('\x1b[31m', 'player count', playerCount, '\x1b[0m');

      if (playerCount > 10) {
        return this.playerCouldBeIn(playerCount);
      }
      return this.playerIsIn(playerCount);
    } catch (e) {
      console.log('\x1b[31m', 'error', e, '\x1b[0m');
    }
  }

  playerIsIn(playerCount) {
    return {
      text: `:+1: Wooo you're in!`,
      attachments: [
        { text: `Players so far: *${playerCount}*`, mrkdwn_in: ['text'] }
      ]
    };
  }

  playerAlreadyIn(playerCount) {
    return {
      text: `:+1: You're already in!`,
      attachments: [
        { text: `Players so far: *${playerCount}*`, mrkdwn_in: ['text'] }
      ]
    };
  }

  playerCouldBeIn(playerCount) {
    return {
      text: `You're number ${playerCount}!`,
      attachments: [
        {
          text: `You could be playing, as we have over 10 a humanoid will make the final decision. Priority is as follows: Missed out last week, Manifesto employee, Ringer`
        }
      ]
    };
  }

  async addToMatch(nextMatch, player) {
    const id = nextMatch.id;
    const playerId = player.id;
    const where = { id: id };

    // If player had opted out before then also connect to players out
    const playerWasNotPlaying = nextMatch.playersOut.some(
      playerNotPlaying => playerNotPlaying.id === player.id
    );

    const data = playerWasNotPlaying
      ? {
          data: {
            players: {
              connect: { id: playerId }
            },
            playersOut: {
              disconnect: { id: playerId }
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

    try {
      const UpdateMatch = await this.db.mutation.updateMatch(
        {
          data,
          where
        },
        '{ id time players { id name }}'
      );
      return UpdateMatch;
    } catch (e) {
      throw e;
    }
  }
};
