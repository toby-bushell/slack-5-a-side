import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from '../user';
import { Typography, TextField, Button } from '@material-ui/core';
import { navigate } from '@reach/router';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

class SignIn extends Component {
  state = {
    name: '',
    password: '',
    email: '',
    formError: null
  };
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    const { formError } = this.state;
    console.log('form error', formError);

    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signup, { error, loading }) => (
          <form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              try {
                const response = await signup();
                console.log(response);
                this.setState({ name: '', email: '', password: '' });
                navigate('/');
              } catch (e) {
                this.setState({ formError: e.message });
                console.log('error in sign in', e);
              }
            }}
          >
            <Typography variant={'h4'} gutterBottom>
              Sign into your account
            </Typography>
            {formError && (
              <Typography color="error" gutterBottom>
                {formError}
              </Typography>
            )}

            <div htmlFor="email">
              <TextField
                type="email"
                name="email"
                placeholder="email"
                InputLabelProps={{ shrink: true }}
                label="Email"
                value={this.state.email}
                onChange={this.saveToState}
                style={{ marginBottom: '20px' }}
                required
              />
            </div>
            <div htmlFor="password">
              <TextField
                type="password"
                name="password"
                placeholder="password"
                value={this.state.password}
                onChange={this.saveToState}
                label={'Password'}
                style={{ marginBottom: '20px' }}
                InputLabelProps={{ shrink: true }}
                required
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Sign In!
            </Button>
          </form>
        )}
      </Mutation>
    );
  }
}

export default SignIn;
