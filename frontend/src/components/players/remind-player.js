import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
// Styled
import { Button } from '@material-ui/core';

const REMIND_PLAYER = gql`
  mutation REMIND_PLAYER($matchId: ID!, $playerId: ID!) {
    sendReminder(playerId: $playerId, matchId: $matchId)
  }
`;

const RemindPlayer = ({ matchId, playerId }) => (
  <Mutation mutation={REMIND_PLAYER} variables={{ matchId, playerId }}>
    {(remindPlayer, { loading, error }) => (
      <div>
        <Button
          variant="contained"
          onClick={async e => {
            const res = await remindPlayer();
            console.log('add response', res);
          }}
        >
          {loading ? 'REMINDING' : 'REMIND'}
        </Button>
      </div>
    )}
  </Mutation>
);

export default RemindPlayer;
export { REMIND_PLAYER };
