import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import PlayersBalanceList from './players-balance-list';
import { ALL_PLAYERS_QUERY } from '../players';
import { theme } from '../../theme';

// Material UI
import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
  Button
} from '@material-ui/core';

const PLAYER_PAYMENT = gql`
  mutation playerPayment($playerId: ID!, $amount: Int!) {
    playerPayment(playerId: $playerId, amount: $amount) {
      id
      payments {
        time
        amountPaid
      }
      name
      username
      image
    }
  }
`;

/* eslint-disable */
const Composed = adopt({
  getPlayers: ({ render }) => <Query query={ALL_PLAYERS_QUERY}>{render}</Query>,
  playerPaid: ({ render }) => (
    <Mutation mutation={PLAYER_PAYMENT}>{render}</Mutation>
  )
});
/* eslint-enable */

class Players extends Component {
  state = {
    playerId: '',
    amount: '',
    loading: false
  };

  componentDidMount() {}

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    console.log('this state', this.state);

    return (
      <Composed>
        {({ getPlayers, playerPaid }) => {
          if (getPlayers.loading) return <p>Loading ...</p>;
          if (getPlayers.error) return <p>Error: {getPlayers.error.message}</p>;
          const players = getPlayers.data.players;
          console.log('getPlayers', getPlayers);
          return (
            <Grid>
              <Typography variant="h5" gutterBottom>
                All Players
              </Typography>
              <form
                style={{ marginBottom: theme.xlSpacing }}
                noValidate
                onSubmit={async e => {
                  e.preventDefault();
                  this.setState({
                    loading: true
                  });
                  try {
                    console.log('player paid', this.state);
                    await playerPaid({
                      variables: { ...this.state }
                    });
                    this.setState({
                      loading: false
                    });
                  } catch (e) {
                    console.log('errors: ', e);
                    this.setState({
                      loading: false
                    });
                  }
                }}
              >
                <div style={{ marginBottom: theme.spacing }}>
                  <FormControl>
                    <InputLabel htmlFor="age-required">Player</InputLabel>
                    <Select
                      value={this.state.playerId}
                      onChange={this.handleChange}
                      name="playerId"
                      style={{ width: '150px' }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {players &&
                        players.map(player => (
                          <MenuItem
                            key={player.id}
                            value={player.id}
                            selected={this.state.playerId === player.id}
                          >
                            {player.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
                <div style={{ marginBottom: theme.spacing }}>
                  <TextField
                    id="standard-number"
                    label="Amount paid"
                    name="amount"
                    value={this.state.amount}
                    onChange={this.handleChange}
                    type="number"
                    margin="normal"
                  />
                  <FormHelperText>Required</FormHelperText>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    disabled={this.state.loading}
                  >
                    Submit
                  </Button>
                </div>
              </form>
              {/* Player list */}
              <PlayersBalanceList players={players} />
            </Grid>
          );
        }}
      </Composed>
    );
  }
}

export default Players;
export { ALL_PLAYERS_QUERY };
