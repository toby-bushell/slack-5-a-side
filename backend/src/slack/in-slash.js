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
      text: `You're in!`,
      attachments: [
        {
          text: `Players so far: ${playerCount}`
        }
      ]
    };
  }

  playerAlreadyIn(playerCount) {
    return {
      text: `You're already in!`,
      attachments: [
        {
          text: `Players so far: ${playerCount}`
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

  async addToMatch(nextMatch, player) {
    const id = nextMatch.id;
    const playerId = player.id;
    const where = { id: id };

    try {
      const UpdateMatch = await this.db.mutation.updateMatch(
        {
          data: {
            players: {
              connect: { id: playerId }
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
};

//   try {
//     const playerAdded = await DB.updatePlayersMatch(
//       user_id,
//       user_name,
//       'player',
//       true
//     );
//     const { active } = playerAdded;

//     // If active is false then return a message that there is no game
//     if (!active) {
//       const response = {
//         text: `No game this week`,
//         attachments: [
//           {
//             text: `We are either between seasons or Matt might have mucked up`
//           }
//         ]
//       };

//       return response;
//     }

//     const { playerCount } = playerAdded;
//     const response = {
//       text: `You're in!`,
//       attachments: [
//         {
//           text: `Players so far: ${playerCount}`
//         }
//       ]
//     };
//     return response;
//   } catch (error) {
//     console.log('\x1b[31m', 'error', error, '\x1b[0m');
//     return error;
//   }
