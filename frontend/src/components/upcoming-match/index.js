import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Match from './match';
import moment from 'moment';

// Material
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

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
      }
    }
  }
`;

class Matches extends Component {
  render() {
    return (
      <div>
        <Query
          query={NEXT_MATCHES_QUERY}
          variables={{ currentTime: moment().startOf('day') }}
        >
          {({ data, error, loading }) => {
            console.log('loading', loading, data);
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;

            return (
              <Grid>
                {data.matches.map(match => (
                  <Match key={match.id} match={match} />
                ))}
              </Grid>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default Matches;
export { ALL_MATCHES_QUERY, NEXT_MATCHES_QUERY };
