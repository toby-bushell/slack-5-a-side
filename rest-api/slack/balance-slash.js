module.exports = class BalanceSlash {
  constructor(graphQLClient, body) {
    this.graphQl = graphQLClient;
    this.body = body;
  }

  async response(player) {
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

  playerOwesMoney(balance) {
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

  playerIsInCredit(balance) {
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
};
