import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
// Queries
import { NEXT_MATCHES_QUERY } from '../upcoming-match';
// Styles
import { Form } from '../styles/forms';
import { Container } from '../styles/containers';

const CREATE_MATCH_MUTATION = gql`
  mutation CREATE_MATCH_MUTATION($time: DateTime!) {
    createMatch(time: $time) {
      id
      time
      players {
        id
        name
      }
    }
  }
`;

class CreateMatch extends Component {
  state = {
    time: ''
  };

  handleChange = e => {
    const { name: fieldName, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [fieldName]: val });
  };

  render() {
    return (
      <Mutation
        mutation={CREATE_MATCH_MUTATION}
        variables={this.state}
        awaitRefetchQueries
        refetchQueries={[
          {
            query: NEXT_MATCHES_QUERY,
            variables: { currentTime: moment().startOf('day') }
          }
        ]}
      >
        {(createMatch, { loading, error }) => (
          <Container>
            <Form
              data-test="form"
              onSubmit={async e => {
                e.preventDefault();
                console.log('submitting', this.state);

                const res = await createMatch();
                console.log('response', res);
              }}
            >
              <h3>Create match</h3>
              <p>{error}</p>
              <fieldset disabled={loading} aria-busy={loading}>
                <div className="field">
                  <label htmlFor="time" className="label">
                    Day
                    <input
                      type="date"
                      id="time"
                      name="time"
                      placeholder="Name"
                      required
                      value={this.state.name}
                      onChange={this.handleChange}
                    />
                  </label>
                </div>
                <button type="submit">Submit</button>
              </fieldset>
            </Form>
          </Container>
        )}
      </Mutation>
    );
  }
}

export default CreateMatch;
export { CREATE_MATCH_MUTATION };
