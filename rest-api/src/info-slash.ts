import * as moment from 'moment';
import { Match, AdminOptions } from './types';

export class InfoSlash {
  constructor(private graphQLClient: any) {}

  async response(nextMatch: Match) {
    // Respond with time and date of next match and a list of players that are playing

    // 1) Get the time set in admin options
    const query = `{
      adminOptions(first: 1) {
        id
        reminderTime
        maxPlayers
        koTime
      }
    }`;
    const adminOptionsArray = await this.graphQLClient
      .request(query)
      .catch((e: Error) => {
        throw e;
      });
    console.log('\x1b[31m', 'adminOptionsArray', adminOptionsArray, '\x1b[0m');

    const adminOptions: AdminOptions = adminOptionsArray.adminOptions[0]; // Only ever one set
    const { koTime } = adminOptions;

    // 2) Get date from next match
    const { time } = nextMatch;
    const formattedDate: string = moment(time).format('dddd, Do, MMMM YYYY');

    // 3) Join date and time TODO: set time of match in match creation?
    const timeAndDate = `${koTime} - ${formattedDate}`;

    // 4) Create string with list of players playing
    const playersList =
      nextMatch.players.length > 0
        ? `
        ${nextMatch.players
          .map(
            (player, i) =>
              `${i + 1}) ${player.name} ${
                String(player.userType) === 'RINGER' ? '(Ringer)' : ''
              }\n`
          )
          .join('')}`
        : 'No players yet';

    // 5) Return JSON
    return {
      text: `*Next match*: ${timeAndDate}`,
      attachments: [{ title: `Players playing`, text: `${playersList}` }]
    };
  }
}
