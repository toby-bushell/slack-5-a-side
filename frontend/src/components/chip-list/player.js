import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
// Queries
import { NEXT_MATCHES_QUERY } from '../upcoming-match';
import { PLAYERS_NOT_IN_MATCH } from '../upcoming-match/match';
// Material
import { Chip, Avatar } from '@material-ui/core';

const REMOVE_PLAYER_FROM_MATCH = gql`
  mutation REMOVE_PLAYER_FROM_MATCH($id: ID!, $playerId: ID!) {
    removeFromMatch(id: $id, playerId: $playerId) {
      id
    }
  }
`;

class Player extends Component {
  update = (cache, payload) => {
    const { id: playerId } = this.props.player;

    // manually update the cache on the client, so it matches the server
    // 1. Read the cache for the matches we want
    console.log('cache?', cache);
    const data = cache.readQuery({
      query: NEXT_MATCHES_QUERY,
      variables: { currentTime: moment().startOf('day') }
    });
    data.matches.forEach(match => {
      console.log('match loop', match);
      const updatedPlayers = match.players.filter(player => {
        console.log('each player', player, playerId);
        return player.id !== playerId;
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
    const { matchId, player } = this.props;
    const avatar = player.image ? (
      <Avatar src={player.image} />
    ) : (
      <Avatar>R</Avatar>
    );
    return (
      <Mutation
        mutation={REMOVE_PLAYER_FROM_MATCH}
        variables={{ id: matchId, playerId: player.id }}
        update={this.update}
        awaitRefetchQueries
        refetchQueries={[
          { query: PLAYERS_NOT_IN_MATCH, variables: { matchId: matchId } }
        ]}
      >
        {(removeFromMatch, { loading, error }) => (
          <Fragment>
            <Chip
              label={player.name}
              onDelete={removeFromMatch}
              avatar={avatar}
              style={{ margin: '10px' }}
            />
          </Fragment>
        )}
      </Mutation>
    );
  }
}

export default Player;
export { REMOVE_PLAYER_FROM_MATCH };
