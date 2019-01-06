import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
// Queries
import { ALL_PLAYERS_QUERY } from '../players';
// Styles
import {
  Grid,
  Typography,
  Button,
  Card,
  CardActions,
  CardContent
} from '@material-ui/core';

const UPDATE_FROM_SLACK = gql`
  mutation UPDATE_FROM_SLACK {
    saveSlackChannelMembers {
      id
      name
    }
  }
`;

class UpdateFromSlack extends Component {
  state = {
    triggered: false,
    newUsers: []
  };

  listUsers = () => {
    const newUsers = this.state.newUsers;
    const names = newUsers.map(user => user.name);
    return names.join(', ');
  };

  render() {
    const { triggered, newUsers } = this.state;
    console.log('this state', this.state);

    return (
      <Mutation
        mutation={UPDATE_FROM_SLACK}
        refetchQueries={[{ query: ALL_PLAYERS_QUERY }]}
      >
        {(saveSlackChannelMembers, { loading, error }) => (
          <Grid>
            <Card style={{ marginBottom: '30px' }}>
              <CardContent>
                <Typography variant="h5">
                  Refresh users from slack members
                </Typography>

                {triggered && (
                  <Typography paragraph gutterBottom>
                    {newUsers.length > 0
                      ? `${newUsers.length} new player${
                          newUsers.length > 1 ? `s` : ``
                        } added: ${this.listUsers()}`
                      : `no new users added`}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={async e => {
                    const res = await saveSlackChannelMembers();
                    const newUsers = res.data.saveSlackChannelMembers;
                    this.setState({ triggered: true, newUsers });
                  }}
                >
                  Fetch{loading && 'ing'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        )}
      </Mutation>
    );
  }
}

export default UpdateFromSlack;
export { UPDATE_FROM_SLACK };
