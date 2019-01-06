import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PlayersList from '../players/players-list';
import { formatToDay } from '../../utils/format-time';

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

class SingleMatch extends Component {
  render() {
    return (
      <Query query={GET_MATCH_QUERY} variables={{ id: this.props.id }}>
        {({ data, error, loading, networkStatus }) => {
          console.log(data);
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error: {error.message}</p>;
          const matchData = data.match ? data.match : null;
          if (!matchData) return null;
          console.log('match data', matchData);

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
              <PlayersList players={matchData.players} />
            </Grid>
          );
        }}
      </Query>
    );
  }
}

export default SingleMatch;
export { GET_MATCH_QUERY };
