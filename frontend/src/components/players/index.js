import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PlayersList from './players-list';
// Material UI
import { Grid, Typography } from '@material-ui/core';

const ALL_PLAYERS_QUERY = gql`
  query ALL_PLAYERS_QUERY {
    players(orderBy: userType_DESC) {
      id
      name
      userType
      reminders
      image
      payments {
        time
        amountPaid
      }
      matchesPlayed {
        id
        time
      }
    }
  }
`;

class Players extends Component {
  render() {
    return (
      <Query
        query={ALL_PLAYERS_QUERY}
        // fetchPolicy="network-only"
      >
        {({ data, error, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error: {error.message}</p>;
          console.log(data);
          return (
            <Grid>
              <Typography variant="h5" gutterBottom>
                All Players
              </Typography>
              <PlayersList players={data.players} deletePossible={true} />
            </Grid>
          );
        }}
      </Query>
    );
  }
}

export default Players;
export { ALL_PLAYERS_QUERY };
