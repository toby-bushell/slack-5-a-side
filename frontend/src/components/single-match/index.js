import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Container } from '../styles/containers';
import Playing from './playing';
import PossiblePlayers from './possible-players';
import { log } from 'async';

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
      }
    }
  }
`;

class SingleMatch extends Component {
  render() {
    return (
      <div>
        <Query query={GET_MATCH_QUERY} variables={{ id: this.props.id }}>
          {({ data, error, loading, networkStatus }) => {
            console.log(data);
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;
            const matchData = data.match ? data.match : null;
            if (!matchData) return null;
            return (
              <Container>
                <h3>Match id: {this.props.id}</h3>
                <Playing matchData={matchData} />
                <PossiblePlayers matchData={matchData} />
              </Container>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default SingleMatch;
export { GET_MATCH_QUERY };
