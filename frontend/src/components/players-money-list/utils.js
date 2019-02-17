export const getPlayerBalance = player => {
  console.log('ermmmmmmm');

  const amountPaid = player.payments.reduce(
    (accumulator, payment, currentIndex, array) => {
      return accumulator + payment.amountPaid;
    },
    0
  );
  const amountOwed = player.matchesPlayed.length * 5;
  const balance = amountPaid - amountOwed;

  return balance;
};

export const amountColours = amount => (amount > 0 ? 'green' : 'red');
