import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
// Queries
import { ALL_PLAYERS_QUERY } from '../players';
// Styles
import { Container } from '../styles/containers';

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
          <Container>
            <h3>Refresh users from slack members</h3>
            {triggered && (
              <p>
                {newUsers.length > 0
                  ? `${newUsers.length} new player${
                      newUsers.length > 1 ? `s` : ``
                    } added: ${this.listUsers()}`
                  : `no new users added`}
              </p>
            )}
            <button
              disabled={loading}
              onClick={async e => {
                const res = await saveSlackChannelMembers();
                const newUsers = res.data.saveSlackChannelMembers;
                this.setState({
                  triggered: true,
                  newUsers
                });
              }}
            >
              Get{loading && 'ting'} users
            </button>
          </Container>
        )}
      </Mutation>
    );
  }
}

export default UpdateFromSlack;
export { UPDATE_FROM_SLACK };
