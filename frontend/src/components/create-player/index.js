import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
// Queries
import { ALL_PLAYERS_QUERY } from '../players';
// Styles
import { Form } from '../styles/forms';
import { Container } from '../styles/containers';

const CREATE_RINGER_MUTATION = gql`
  mutation CREATE_RINGER_MUTATION($name: String!, $email: String!) {
    createRinger(name: $name, email: $email) {
      id
    }
  }
`;

class CreateRinger extends Component {
  state = {
    name: '',
    email: ''
  };

  handleChange = e => {
    const { name: fieldName, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [fieldName]: val });
  };

  render() {
    return (
      <Mutation
        mutation={CREATE_RINGER_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: ALL_PLAYERS_QUERY }]}
      >
        {(createRinger, { loading, error }) => (
          <Container>
            <Form
              data-test="form"
              onSubmit={async e => {
                e.preventDefault();
                await createRinger();
              }}
            >
              <h3>Create ringer</h3>
              <p>{error}</p>

              <fieldset disabled={loading} aria-busy={loading}>
                <label htmlFor="name">
                  Name
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    required
                    value={this.state.name}
                    onChange={this.handleChange}
                  />
                </label>
                <label htmlFor="email">
                  Email
                  <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Email"
                    required
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </label>
                <label htmlFor="userType">
                  User Type
                  <input
                    disabled
                    type="text"
                    id="userType"
                    name="userType"
                    required
                    value={'RINGER'}
                    onChange={this.handleChange}
                  />
                </label>
                <button type="submit">Submit</button>
              </fieldset>
            </Form>
          </Container>
        )}
      </Mutation>
    );
  }
}

export default CreateRinger;
export { CREATE_RINGER_MUTATION };
