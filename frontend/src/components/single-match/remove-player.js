import React, { Framgent } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
// Queries
import { GET_MATCH_QUERY } from './index';
// Styled
import { Button } from '../styles/buttons';

const REMOVE_PLAYER_MUTATION = gql`
  mutation REMOVE_PLAYER_MUTATION($id: ID!, $playerId: ID!) {
    removeFromMatch(id: $id, playerId: $playerId) {
      id
      players {
        name
      }
    }
  }
`;

const RemoveFromMatch = ({ matchId, playerId }) => (
  <Mutation
    mutation={REMOVE_PLAYER_MUTATION}
    variables={{ id: matchId, playerId }}
    awaitRefetchQueries
    refetchQueries={[{ query: GET_MATCH_QUERY, variables: { id: matchId } }]}
  >
    {(removeFromMatch, { loading, error }) => (
      <Button
        onClick={async e => {
          const res = await removeFromMatch();
          console.log('remove response', res);
        }}
      >
        REMOV{loading ? 'ING' : 'E'}
      </Button>
    )}
  </Mutation>
);

export default RemoveFromMatch;
export { REMOVE_PLAYER_MUTATION };
