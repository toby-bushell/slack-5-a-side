import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
// Queries
import { ALL_PLAYERS_QUERY } from '../players';
// Material
import { Button } from '@material-ui/core';

const DELETE_PLAYER_MUTATION = gql`
  mutation DELETE_PLAYER_MUTATION($id: ID!) {
    deletePlayer(id: $id) {
      id
    }
  }
`;

const DeletePlayer = ({ id }) => (
  <Mutation
    mutation={DELETE_PLAYER_MUTATION}
    variables={{ id: id }}
    refetchQueries={[{ query: ALL_PLAYERS_QUERY }]}
  >
    {(deletePlayer, { loading, error }) => (
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={async e => {
            const check = window.confirm('Want to delete?');
            if (!check) return;
            const res = await deletePlayer();
            console.log('delete response', res);
          }}
        >
          DELET{loading ? 'ING' : 'E'}
        </Button>
      </div>
    )}
  </Mutation>
);

export default DeletePlayer;
export { DELETE_PLAYER_MUTATION };
