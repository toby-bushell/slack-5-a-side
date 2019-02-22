import { Player } from './types';

export class BalanceSlash {
  constructor(private graphQLClient: any) {}

  async response(player: Player) {
    console.log('\x1b[31m', 'player', player, '\x1b[0m');

    const amountPaid = player.payments.reduce(
      (accumulator, payment, currentIndex, array) => {
        return accumulator + payment.amountPaid;
      },
      0
    );
    const amountOwed = player.matchesPlayed.length * 5;
    const balance = amountPaid - amountOwed;

    if (balance > 0) {
      return this.playerIsInCredit(balance);
    } else {
      return this.playerOwesMoney(balance);
    }
  }

  playerOwesMoney(balance: number) {
    return {
      text: `:grimacing: You owe some money!`,
      attachments: [
        {
          text: `Balance: *£${balance}*`,
          mrkdwn_in: ['text'],
          color: 'danger'
        }
      ]
    };
  }

  playerIsInCredit(balance: number) {
    return {
      text: `:+1: You are in credit!`,
      attachments: [
        {
          text: `Balance: *£${balance}*`,
          mrkdwn_in: ['text'],
          color: 'good'
        }
      ]
    };
  }
}
