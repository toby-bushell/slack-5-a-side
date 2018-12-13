import React, { Component, Fragment } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
// Queries
import { NEXT_MATCHES_QUERY } from '../upcoming-match';
import { PLAYERS_NOT_IN_MATCH } from '../upcoming-match/match';
// Styled
import Button from '@material-ui/core/Button';
import { match } from '@reach/router/lib/utils';

const REMOVE_PLAYER_FROM_MATCH = gql`
  mutation REMOVE_PLAYER_FROM_MATCH($id: ID!, $playerId: ID!) {
    removeFromMatch(id: $id, playerId: $playerId) {
      id
    }
  }
`;

class RemoveFromMatch extends Component {
  update = (cache, payload) => {
    console.log('this props ', this.props);

    // manually update the cache on the client, so it matches the server
    // 1. Read the cache for the matches we want
    console.log('cache?', cache);
    const data = cache.readQuery({
      query: NEXT_MATCHES_QUERY,
      variables: { currentTime: moment().startOf('day') }
    });
    data.matches.map(match => {
      console.log('match loop', match);
      const updatedPlayers = match.players.filter(player => {
        console.log('each player', player, this.props.playerId);
        return player.id !== this.props.playerId;
      });

      match.players = updatedPlayers;
    });

    // 3. Put the matches back!
    cache.writeQuery({
      query: NEXT_MATCHES_QUERY,
      variables: { currentTime: moment().startOf('day') },
      data
    });
  };
  render() {
    const { matchId, playerId } = this.props;
    return (
      <Mutation
        mutation={REMOVE_PLAYER_FROM_MATCH}
        variables={{ id: matchId, playerId }}
        update={this.update}
        awaitRefetchQueries
        refetchQueries={[
          { query: PLAYERS_NOT_IN_MATCH, variables: { matchId: matchId } }
        ]}
      >
        {(removeFromMatch, { loading, error }) => (
          <Fragment>
            {console.log(matchId, playerId)}

            <Button
              color="secondary"
              variant="contained"
              onClick={async e => {
                const res = await removeFromMatch();
                console.log('add response', res);
              }}
            >
              {loading ? 'REMOVING' : 'REMOVE FROM MATCH'}
            </Button>
          </Fragment>
        )}
      </Mutation>
    );
  }
}

export default RemoveFromMatch;
export { REMOVE_PLAYER_FROM_MATCH };
