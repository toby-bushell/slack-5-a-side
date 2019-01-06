import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
// Queries
import { ALL_PLAYERS_QUERY } from '../players';
// Material
import { Button } from '@material-ui/core';

const CHANGE_PLAYER_TYPE_MUTATION = gql`
  mutation CHANGE_PLAYER_TYPE_MUTATION($id: ID!, $type: UserType!) {
    updateUserType(type: $type, id: $id) {
      name
      userType
    }
  }
`;

const ChangeUserType = ({ id, type }) => (
  <Mutation
    mutation={CHANGE_PLAYER_TYPE_MUTATION}
    refetchQueries={[{ query: ALL_PLAYERS_QUERY }]}
  >
    {(changePlayerType, { loading, error }) => (
      <div>
        {console.log('id', id)}
        {type === 'MANIFESTO' && (
          <Button
            variant="contained"
            onClick={async e => {
              const res = await changePlayerType({
                variables: { id, type: 'CONTRACTOR' }
              });
              console.log('change type response', res);
            }}
          >
            {loading ? 'CHANGING' : 'TO CONTRACTOR'}
          </Button>
        )}
        {type === 'CONTRACTOR' && (
          <Button
            variant="contained"
            onClick={async e => {
              const res = await changePlayerType({
                variables: { id, type: 'MANIFESTO' }
              });
              console.log('change type response', res);
            }}
          >
            {loading ? 'CHANGING' : 'TO MANIFESTO'}
          </Button>
        )}
      </div>
    )}
  </Mutation>
);

export default ChangeUserType;
export { CHANGE_PLAYER_TYPE_MUTATION };
