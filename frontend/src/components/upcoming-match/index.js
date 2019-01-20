import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Match from './match';
import moment from 'moment';
import { Link } from '@reach/router';

// Material
import { Grid, Typography, Button, Card, CardContent } from '@material-ui/core';

const ALL_MATCHES_QUERY = gql`
  query ALL_MATCHES_QUERY {
    matches {
      id
      time
      players {
        id
        name
        username
        image
      }
    }
  }
`;

const NEXT_MATCHES_QUERY = gql`
  query NEXT_MATCHES_QUERY($currentTime: DateTime!) {
    matches(where: { time_gt: $currentTime }, orderBy: time_ASC, first: 1) {
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

class Matches extends Component {
  render() {
    return (
      <Query
        query={NEXT_MATCHES_QUERY}
        variables={{ currentTime: moment().startOf('day') }}
      >
        {({ data, error, loading }) => {
          console.log('loading', loading, data);
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error: {error.message}</p>;

          if (data.matches && data.matches.length === 0) {
            return (
              <Grid>
                <Card style={{ marginBottom: '30px' }}>
                  <CardContent>
                    <Typography variant={'h5'} style={{ marginBottom: '30px' }}>
                      No upcoming match, create one?
                    </Typography>
                    <Button variant="contained" component={Link} to="/matches">
                      Create match
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          }
          return (
            <Grid>
              {data.matches.map(match => (
                <Match key={match.id} match={match} />
              ))}
            </Grid>
          );
        }}
      </Query>
    );
  }
}

export default Matches;
export { ALL_MATCHES_QUERY, NEXT_MATCHES_QUERY };
