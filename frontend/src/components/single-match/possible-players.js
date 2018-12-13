import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import AddToMatch from './add-to-match';

const GET_POSSIBLE_PLAYERS_QUERY = gql`
  query GET_POSSIBLE_PLAYERS_QUERY($id_not_in: [ID!]) {
    players(where: { id_not_in: $id_not_in }) {
      id
      userType
      name
    }
  }
`;

class PossiblePlayers extends Component {
  render() {
    const { matchData } = this.props;
    return (
      <Fragment>
        <Query
          query={GET_POSSIBLE_PLAYERS_QUERY}
          variables={{ id_not_in: Array.from(matchData.players, x => x.id) }}
        >
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;

            return (
              <div>
                <AddToMatch players={data.players} matchId={matchData.id} />
              </div>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

export default PossiblePlayers;
