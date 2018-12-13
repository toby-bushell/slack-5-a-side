import React, { Component } from 'react';
import Select from 'react-select';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

// Queries
import { ALL_MATCHES_QUERY } from '../upcoming-match';
import { GET_MATCH_QUERY } from './index';
// Styles
import { Form } from '../styles/forms';
import { Button } from '../styles/buttons';

const ADD_TO_MATCH_MUTATION = gql`
  mutation ADD_TO_MATCH_MUTATION($id: ID!, $playerId: ID!) {
    addToMatch(id: $id, playerId: $playerId) {
      id
    }
  }
`;

class PlayersSelect extends Component {
  state = {
    options: [],
    selectedOption: null
  };
  handleSelectChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  componentDidMount() {
    if (!this.props.players) return;
    const options = this.props.players.map(player => {
      return { value: player.id, label: player.name };
    });

    this.setState({
      options
    });
  }
  render() {
    const { selectedOption, options } = this.state;
    console.log('props', this.props, selectedOption);

    return (
      <Mutation
        mutation={ADD_TO_MATCH_MUTATION}
        refetchQueries={[
          { query: ALL_MATCHES_QUERY },
          { query: GET_MATCH_QUERY, variables: { id: this.props.matchId } }
        ]}
      >
        {(addToMatch, { loading, error }) => (
          <Form
            data-test="form"
            onSubmit={async e => {
              e.preventDefault();
              console.log(
                'submitting',
                selectedOption.value,
                this.props.matchId
              );
              const res = await addToMatch({
                variables: {
                  id: this.props.matchId,
                  playerId: selectedOption.value
                }
              });
              console.log('res adding to match', res);
            }}
          >
            <h3>Possible players to add to match</h3>
            <p>{error}</p>

            <fieldset disabled={loading} aria-busy={loading}>
              <Select
                value={selectedOption}
                onChange={this.handleSelectChange}
                options={options}
              />
              <Button type="submit">Submit</Button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default PlayersSelect;
