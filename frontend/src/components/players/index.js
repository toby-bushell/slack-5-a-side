import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PleaseSignIn from '../please-sign-in';

import PlayersList from './players-list';
import { Container } from '../styles/containers';

const ALL_PLAYERS_QUERY = gql`
  query ALL_PLAYERS_QUERY {
    players(orderBy: userType_DESC) {
      id
      name
      userType
      reminders
    }
  }
`;

class Players extends Component {
  render() {
    return (
      <div>
        <Query
          query={ALL_PLAYERS_QUERY}
          // fetchPolicy="network-only"
        >
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;
            console.log(data);
            return (
              <Container>
                <PlayersList players={data.players} deletePossible={true} />
              </Container>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default Players;
export { ALL_PLAYERS_QUERY };
