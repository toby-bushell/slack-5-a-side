import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PlayersList from '../players/players-list';
import { formatToDay } from '../../utils/format-time';
import { adopt } from 'react-adopt';

import { Grid, Typography, Card, CardContent } from '@material-ui/core';

const GET_MATCH_QUERY = gql`
  query GET_MATCH_QUERY($id: ID!) {
    match(where: { id: $id }) {
      id
      time
      players {
        id
        name
        username
        image
        userType
      }
    }
  }
`;

const PLAYERS_WERE_NOT_IN_MATCH = gql`
  query PLAYERS_WERE_NOT_IN_MATCH($id: ID!) {
    players(where: { matchesPlayed_every: { id_not: $id } }) {
      id
      userType
      name
      slackId
      image
      matchesOptedOut {
        id
      }
      matchesPlayed {
        id
      }
    }
  }
`;

/* eslint-disable */
const Composed = adopt({
  getMatchData: ({ render, id }) => (
    <Query query={GET_MATCH_QUERY} variables={{ id: id }}>
      {render}
    </Query>
  ),
  playersNotInMatch: ({ render, id }) => (
    <Query query={PLAYERS_WERE_NOT_IN_MATCH} variables={{ id: id }}>
      {render}
    </Query>
  )
});
/* eslint-enable */

class SingleMatch extends Component {
  render() {
    console.log('this props', this.props);

    return (
      <Composed id={this.props.id}>
        {({ getMatchData, playersNotInMatch }) => {
          if (getMatchData.loading) return <p>Loading ...</p>;
          if (playersNotInMatch.loading) return <p>Loading ...</p>;
          if (getMatchData.error)
            return <p>Error: {getMatchData.error.message}</p>;

          const matchData = getMatchData.data.match;
          const notInMatch = playersNotInMatch.data;

          console.log('notInMatch', notInMatch);
          console.log(matchData);
          return (
            <Grid>
              <Card style={{ marginBottom: '30px' }}>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    Match
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    {formatToDay(matchData.time)}
                  </Typography>
                  <Typography paragraph id="tableTitle">
                    ID: {matchData.id}
                  </Typography>
                </CardContent>
              </Card>
              <Typography variant="h5" gutterBottom>
                Players played
              </Typography>
              <PlayersList
                matchId={matchData.id}
                removeFromMatch
                players={matchData.players}
                singleMatch
                remindPossible={false}
              />
              <Typography variant="h5" gutterBottom>
                Players who didn't play
              </Typography>
              <PlayersList
                players={notInMatch.players}
                matchId={matchData.id}
                notInUpcomingMatch={true}
                playedSort={true}
                singleMatch
                remindPossible={false}
              />
            </Grid>
          );
        }}
      </Composed>
    );
  }
}

export default SingleMatch;
export { GET_MATCH_QUERY };
