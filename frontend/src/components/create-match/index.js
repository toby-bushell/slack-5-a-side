import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import Message from '../message';
// Queries
import { FUTURE_MATCHES_QUERY } from '../future-matches';
// Styles
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  FormControl
} from '@material-ui/core/';

const CREATE_MATCH_MUTATION = gql`
  mutation CREATE_MATCH_MUTATION($time: DateTime!) {
    createMatch(time: $time) {
      id
      time
      players {
        id
        name
      }
      reminderTime
      playersOut {
        id
        name
      }
    }
  }
`;

class CreateMatch extends Component {
  state = {
    time: '',
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
        mutation={CREATE_MATCH_MUTATION}
        variables={{ time: this.state.time }}
        awaitRefetchQueries
        refetchQueries={[
          {
            query: FUTURE_MATCHES_QUERY,
            variables: { currentTime: moment().startOf('day') }
          }
        ]}
      >
        {(createMatch, { loading, error }) => {
          return (
            <Card style={{ marginBottom: '40px' }}>
              {message && (
                <Message
                  text={message}
                  variant={error || this.state.error ? 'error' : null}
                />
              )}
              <CardContent>
                <form
                  data-test="form"
                  onSubmit={async e => {
                    e.preventDefault();
                    try {
                      await createMatch();
                      this.setState({
                        message: 'Match successfully created',
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
                  <Typography variant={'h4'} gutterBottom>
                    Create match
                  </Typography>
                  <FormControl>
                    <TextField
                      id="date"
                      name="time"
                      label="Date"
                      type="date"
                      value={this.state.time}
                      InputLabelProps={{ shrink: true }}
                      onChange={this.handleChange}
                      style={{ marginBottom: '20px' }}
                      required
                    />
                  </FormControl>
                  <div>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                    >
                      Creat{loading ? 'ing' : 'e'} Match
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          );
        }}
      </Mutation>
    );
  }
}

export default CreateMatch;
export { CREATE_MATCH_MUTATION };
