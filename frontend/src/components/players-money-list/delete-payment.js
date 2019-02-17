import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
// Queries
import { ALL_PLAYERS_QUERY } from '../players';
// Material
import { Button } from '@material-ui/core';

const DELETE_PAYMENT_MUTATION = gql`
  mutation DELETE_PAYMENT_MUTATION($playerId: ID!, $transactionTime: DateTime) {
    deletePayment(playerId: $playerId, transactionTime: $transactionTime) {
      id
      name
      payments {
        amountPaid
        time
      }
    }
  }
`;

const DeletePayment = ({ player, transaction }) => {
  return (
    <Mutation
      mutation={DELETE_PAYMENT_MUTATION}
      variables={{ playerId: player.id, transactionTime: transaction.time }}
      refetchQueries={[{ query: ALL_PLAYERS_QUERY }]}
    >
      {(deletePayment, { loading, error }) => (
        <div>
          <Button
            variant="contained"
            color="secondary"
            onClick={async e => {
              const check = window.confirm('Want to delete?');
              if (!check) return;
              const res = await deletePayment();
              console.log('delete response', res);
            }}
          >
            DELET{loading ? 'ING' : 'E'}
          </Button>
        </div>
      )}
    </Mutation>
  );
};

export default DeletePayment;
export { DELETE_PAYMENT_MUTATION };
