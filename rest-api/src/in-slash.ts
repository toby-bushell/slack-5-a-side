import { Match, Player } from './types';

export class InSlash {
  constructor() {}

  async response(nextMatch: Match, player: Player) {
    console.log('\x1b[34m', 'firing', '\x1b[0m');

    try {
      // If already playing don't bother adding
      const playerIsIn = nextMatch.players.some(
        playerAlreadyIn => playerAlreadyIn.id === player.id
      );
      if (playerIsIn) return this.playerAlreadyIn(nextMatch.players);

      const updatedMatch: Match = await this.addToMatch(nextMatch, player);
      const playersInMatch = updatedMatch.players;
      const playerCount = playersInMatch.length;

      console.log('\x1b[31m', 'player count', playerCount, '\x1b[0m');

      if (playerCount > 10) {
        return this.playerCouldBeIn(playersInMatch);
      }
      return this.playerIsIn(playersInMatch);
    } catch (e) {
      console.log('\x1b[31m', 'error', e, '\x1b[0m');
    }
  }

  playerIsIn(players: Player[]): object {
    return {
      text: `:+1: Wooo you're in!`,
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

  playerAlreadyIn(players: Player[]) {
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

  playerCouldBeIn(players: Player[]) {
    return {
      text: `You're number ${players.length}!`,
      attachments: [
        {
          text: `You could be playing, as we have over 10 a humanoid will make the final decision. Priority is as follows: Missed out last week, Manifesto employee, Ringer`
        }
      ]
    };
  }

  playersList(players: Player[]) {
    return players.length > 0
      ? `${players
          .map(
            (player, i) =>
              `${i + 1}) ${player.name} ${
                String(player.userType) === 'RINGER' ? '(Ringer)' : ''
              }\n`
          )
          .join('')}`
      : 'No players yet';
  }

  async addToMatch(nextMatch: Match, player: Player) {
    const id = nextMatch.id;
    const playerId = player.id;

    const query = `mutation{
      addToMatch( id: "${id}" playerId: "${playerId}") {
          id
          players {
            id
            name
          }
        }
      }`;

    const updateMatch = await this.graphQl.request(query).catch((e: Error) => {
      throw e;
    });

    console.log('\x1b[32m', 'updatematch', updateMatch, '\x1b[0m');

    return updateMatch.addToMatch;
  }
}
