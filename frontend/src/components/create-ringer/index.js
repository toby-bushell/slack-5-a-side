import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Message from '../message';
// Queries
import { ALL_PLAYERS_QUERY } from '../players';
// Styles
import { Button, TextField, Typography, Grid } from '@material-ui/core';

const CREATE_RINGER_MUTATION = gql`
  mutation CREATE_RINGER_MUTATION($name: String!) {
    createRinger(name: $name) {
      id
    }
  }
`;

class CreateRinger extends Component {
  state = {
    name: '',
    message: '',
    error: false
  };

  handleChange = e => {
    const { name: fieldName, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [fieldName]: val });
  };

  render() {
    const { message } = this.state;

    return (
      <Mutation
        mutation={CREATE_RINGER_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: ALL_PLAYERS_QUERY }]}
      >
        {(createRinger, { loading, error }) => (
          <Grid
            item
            xs={12}
            spacing={16}
            container
            style={{
              display: 'flex',
              padding: '0 14px',
              marginBottom: '40px',
              flexWrap: 'wrap'
            }}
          >
            {message && (
              <Message
                text={message}
                variant={error || this.state.error ? 'error' : null}
              />
            )}
            <form
              data-test="form"
              onSubmit={async e => {
                e.preventDefault();
                try {
                  await createRinger();
                  this.setState({
                    message: 'Ringer successfully created',
                    error: false
                  });
                } catch (e) {
                  this.setState({
                    message: e.message,
                    error: true
                  });
                  console.log('error in creating', e);
                }
              }}
            >
              <Typography variant="h4">Create Ringer</Typography>
              {error && <Typography color={'error'}>{error}</Typography>}
              <div>
                <TextField
                  type="text"
                  id="name"
                  name="name"
                  label="Name"
                  margin={'normal'}
                  required
                  value={this.state.name}
                  onChange={this.handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </div>

              <div>
                <TextField
                  disabled
                  label={'User type'}
                  type="text"
                  id="userType"
                  name="userType"
                  margin={'normal'}
                  required
                  value={'RINGER'}
                  onChange={this.handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Grid>
        )}
      </Mutation>
    );
  }
}

export default CreateRinger;
export { CREATE_RINGER_MUTATION };
