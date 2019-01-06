import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
// import { Items, Row, RowHeader } from '../styles/list';
import { formatToDay } from '../../utils/format-time';
import { Link } from '@reach/router';

import PlayersList from '../players/players-list';
import ChipList from '../chip-list';

// Material
import {
  Typography,
  Button,
  Card,
  CardActions,
  CardContent
} from '@material-ui/core';

const PLAYERS_NOT_IN_MATCH = gql`
  query PLAYERS_NOT_IN_MATCH($matchId: ID!) {
    players(where: { matchesPlayed_every: { id_not: $matchId } }) {
      id
      userType
      name
      slackId
      image
      matchesPlayed {
        id
      }
    }
  }
`;

class Match extends Component {
  render() {
    const { match } = this.props;
    return (
      <Fragment>
        <Card style={{ marginBottom: '30px' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Upcoming Match
            </Typography>
            <Typography variant="h6" id="tableTitle">
              {formatToDay(match.time)}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="outlined"
              component={Link}
              to={`/match/${match.id}`}
            >
              Edit Match
            </Button>
          </CardActions>
        </Card>
        <Typography variant="h5" gutterBottom>
          Players playing
        </Typography>
        <ChipList players={match.players} matchId={match.id} />

        <Query query={PLAYERS_NOT_IN_MATCH} variables={{ matchId: match.id }}>
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;

            console.log('data', data, match);
            return (
              <Fragment>
                <Typography variant="h5" gutterBottom>
                  Potential players
                </Typography>
                <PlayersList
                  players={data.players}
                  matchId={match.id}
                  notInUpcomingMatch={true}
                  playedSort={true}
                />
              </Fragment>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

export default Match;
export { PLAYERS_NOT_IN_MATCH };
