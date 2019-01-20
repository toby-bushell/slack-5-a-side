module.exports = class InSlash {
  constructor(graphQLClient, body) {
    this.graphQl = graphQLClient;
    this.body = body;
  }

  async response(nextMatch, player) {
    console.log('\x1b[34m', 'firing', '\x1b[0m');

    try {
      // If already playing don't bother adding
      const playerIsIn = nextMatch.players.some(
        playerAlreadyIn => playerAlreadyIn.id === player.id
      );
      if (playerIsIn) return this.playerAlreadyIn(nextMatch.players);

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
        {
          text: `Players so far: *${playerCount}*\n${this.playersList(
            players
          )}`,
          mrkdwn_in: ['text']
        }
      ]
    };
  }

  playerAlreadyIn(players) {
    console.log('\x1b[32m', 'already in', players, '\x1b[0m');

    return {
      text: `:+1: You're already in!`,
      attachments: [
        {
          text: `Players so far: *${players.length}*\n${this.playersList(
            players
          )}`,
          mrkdwn_in: ['text']
        }
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

  playersList(players) {
    return players.length > 0
      ? `${players
          .map(
            (player, i) =>
              `${i + 1}) ${player.name} ${
                player.userType === 'RINGER' ? '(Ringer)' : ''
              }\n`
          )
          .join('')}`
      : 'No players yet';
  }

  async addToMatch(nextMatch, player) {
    const id = nextMatch.id;
    const playerId = player.id;

    const query = `mutation{
      addToMatch( id: "${id}" playerId: "${playerId}") {
          id
          players {
            id
          }
        }
      }`;

    const updateMatch = await this.graphQl.request(query).catch(e => {
      throw e;
    });

    console.log('\x1b[32m', 'updatematch', updateMatch, '\x1b[0m');

    return updateMatch.addToMatch;
  }
};
