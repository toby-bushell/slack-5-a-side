import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { formatToDay } from '../../utils/format-time';
import moment from 'moment';
import DeleteMatch from '../matches/delete-match';
// Material
import { List, ListItem, ListItemText, Grid } from '@material-ui/core';

const FUTURE_MATCHES_QUERY = gql`
  query FUTURE_MATCHES_QUERY($currentTime: DateTime!) {
    matches(where: { time_gt: $currentTime }, orderBy: time_ASC) {
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

class FutureMatches extends Component {
  render() {
    return (
      <Query
        query={FUTURE_MATCHES_QUERY}
        variables={{ currentTime: moment().startOf('day') }}
      >
        {({ data, error, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error: {error.message}</p>;

          return (
            <Grid>
              <List>
                {data.matches.map(match => (
                  <ListItem key={match.id}>
                    <ListItemText>{formatToDay(match.time)}</ListItemText>

                    <DeleteMatch id={match.id} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          );
        }}
      </Query>
    );
  }
}

export default FutureMatches;
export { FUTURE_MATCHES_QUERY };
