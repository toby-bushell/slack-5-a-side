import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
// Queries
import { FUTURE_MATCHES_QUERY } from '../future-matches';
import { PAST_MATCHES_QUERY } from '../past-matches';
// Styled
import Button from '@material-ui/core/Button';

const DELETE_MATCH_MUTATION = gql`
  mutation DELETE_MATCH_MUTATION($id: ID!) {
    deleteMatch(id: $id) {
      id
      time
      players {
        id
        name
      }
    }
  }
`;

class DeleteMatch extends Component {
  update = (cache, payload) => {
    const QUERY =
      this.props.query === 'past' ? PAST_MATCHES_QUERY : FUTURE_MATCHES_QUERY;
    // manually update the cache on the client, so it matches the server
    // 1. Read the cache for the matches we want
    console.log('cache?', cache);

    const data = cache.readQuery({
      query: QUERY,
      variables: { currentTime: moment().startOf('day') }
    });
    console.log('data in cache?', data);

    // 2. Filter the deleted item out of the page
    data.matches = data.matches.filter(
      item => item.id !== payload.data.deleteMatch.id
    );
    // 3. Put the matches back!
    cache.writeQuery({
      query: QUERY,
      variables: { currentTime: moment().startOf('day') },
      data
    });
  };

  render() {
    return (
      <Mutation
        mutation={DELETE_MATCH_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
      >
        {(deleteMatch, { loading, error }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error: {error.message}</p>;
          return (
            <div>
              <Button
                color="secondary"
                variant="contained"
                onClick={async e => {
                  e.stopPropagation();
                  const check = window.confirm('Want to delete?');
                  if (!check) return;
                  const res = await deleteMatch();
                  console.log('delete response', res);
                }}
              >
                DELET{loading ? 'ING' : 'E'}
              </Button>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default DeleteMatch;
export { DELETE_MATCH_MUTATION };
