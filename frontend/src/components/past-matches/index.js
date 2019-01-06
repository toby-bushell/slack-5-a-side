import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import DeleteMatch from '../matches/delete-match';
import moment from 'moment';
import { formatToDay } from '../../utils/format-time';
import { Link } from '@reach/router';
import { List, Grid, ListItem, ListItemText, Button } from '@material-ui/core';

const PAST_MATCHES_QUERY = gql`
  query PAST_MATCHES_QUERY($currentTime: DateTime!) {
    matches(where: { time_lt: $currentTime }, orderBy: time_DESC) {
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
          query={PAST_MATCHES_QUERY}
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

                      <Button
                        variant="contained"
                        component={Link}
                        to={`/match/${match.id}`}
                      >
                        View
                      </Button>
                      <DeleteMatch id={match.id} query="past" />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default Matches;
export { PAST_MATCHES_QUERY };
