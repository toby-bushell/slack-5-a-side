import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
// Queries
import { PLAYERS_NOT_IN_MATCH } from '../upcoming-match/match';
import { NEXT_MATCHES_QUERY } from '../upcoming-match';
// Styled
import Button from '@material-ui/core/Button';
import { match } from '@reach/router/lib/utils';

const ADD_PLAYER_TO_MATCH = gql`
  mutation ADD_PLAYER_TO_MATCH($id: ID!, $playerId: ID!) {
    addToMatch(id: $id, playerId: $playerId) {
      id
    }
  }
`;

class AddToMatch extends Component {
  render() {
    const { matchId, playerId } = this.props;
    return (
      <Mutation
        mutation={ADD_PLAYER_TO_MATCH}
        variables={{ id: matchId, playerId }}
        update={this.update}
        refetchQueries={[
          {
            query: NEXT_MATCHES_QUERY,
            variables: { currentTime: moment().startOf('day') }
          },
          { query: PLAYERS_NOT_IN_MATCH, variables: { matchId: matchId } }
        ]}
      >
        {(addToMatch, { loading, error }) => (
          <div>
            {console.log(matchId, playerId)}

            <Button
              color="primary"
              variant="contained"
              onClick={async e => {
                const res = await addToMatch();
                console.log('add response', res);
              }}
            >
              {loading ? 'ADDING' : 'ADD'}
            </Button>
          </div>
        )}
      </Mutation>
    );
  }
}

export default AddToMatch;
export { ADD_PLAYER_TO_MATCH };
