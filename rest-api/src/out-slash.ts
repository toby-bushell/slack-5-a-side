import { Match, Player } from './types';

export class OutSlash {
  constructor(private graphQLClient: any) {}

  async response(nextMatch: Match, player: Player) {
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

  playerIsOut(playerCount: number) {
    return {
      text: `:thumbsdown: You're out... BOO!`,
      attachments: [
        { text: `Players so far: *${playerCount}*`, mrkdwn_in: ['text'] }
      ]
    };
  }

  playerWasNotIn(playerCount: number) {
    return {
      text: `:thumbsdown: You were already not playing!`,
      attachments: [
        { text: `Players so far: *${playerCount}*`, mrkdwn_in: ['text'] }
      ]
    };
  }

  async removeFromMatch(nextMatch: Match, player: Player) {
    const { id } = nextMatch;
    const playerId = player.id;

    console.log(
      '\x1b[32m',
      'remove from match firing in slack',
      id,
      playerId,
      '\x1b[0m'
    );

    const query = `mutation{
      removeFromMatch( id: "${id}" playerId: "${playerId}") {
          id
          players {
            id
          }
        }
      }`;

    const updateMatch = await this.graphQLClient
      .request(query)
      .catch((e: Error) => {
        throw e;
      });
    console.log('\x1b[32m', 'remove updateMatch', updateMatch, '\x1b[0m');

    return updateMatch.removeFromMatch;
  }
}
