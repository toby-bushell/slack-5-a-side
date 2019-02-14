import React, { Component, Fragment } from 'react';
import SlackAvatar from '../slack-avatar';

// Material
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  AppBar,
  Tabs,
  Tab,
  Avatar,
  Typography,
  Toolbar
} from '@material-ui/core';

import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowUpward from '@material-ui/icons/ArrowUpward';

class PlayersList extends Component {
  state = {
    value: 0,
    sortOrder: 'DESC'
  };

  handleChange = async (event, value) => {
    if (value === 3) {
      // Await for state to be set
      await this.updateSortOrder();
      console.log('state after', this.state);
    } else {
      this.setState({ value });
    }
  };

  playerBalance = player => {
    console.log('player balance', player.matchesPlayed.length * 5);
    console.log('player balance', player.amountPaid);

    const amountOwed = player.matchesPlayed.length * 5;
    const balance = player.amountPaid - amountOwed;
    return balance;
  };
  updateSortOrder = async () => {
    const { sortOrder } = this.state;

    if (sortOrder === 'DESC') {
      this.setState({ sortOrder: 'ASC' }, () => true);
    } else {
      this.setState({ sortOrder: 'DESC' }, () => true);
    }
  };
  comparePlayers = (a, b) => {
    if (this.playerBalance(a) < this.playerBalance(b)) return -1;
    if (this.playerBalance(a) > this.playerBalance(b)) return 1;
    return 0;
  };

  sortByBalance = () => {
    const { sortOrder } = this.state;
    const { players } = this.props;
    let sortedPlayers = [...this.props.players];

    console.log('sortedPlayers', sortedPlayers);

    if (sortOrder === 'DESC') {
      sortedPlayers = [...players].sort((a, b) => {
        if (this.playerBalance(a) < this.playerBalance(b)) return -1;
        if (this.playerBalance(a) > this.playerBalance(b)) return 1;
        return 0;
      });
    } else {
      sortedPlayers = [...players].sort((a, b) => {
        if (this.playerBalance(a) > this.playerBalance(b)) return -1;
        if (this.playerBalance(a) < this.playerBalance(b)) return 1;
        return 0;
      });
    }
    return sortedPlayers;
  };

  render() {
    const { value, sortOrder } = this.state;
    let { players } = this.props;
    console.log('players', this.state);

    players = this.sortByBalance();

    const playerList = items =>
      items.length > 0 ? (
        items.map(player => {
          const isInRed = this.playerBalance(player) < 0;

          return (
            <ListItem key={player.id}>
              <ListItemAvatar>
                <SlackAvatar player={player} />
              </ListItemAvatar>
              <ListItemText primary={player.name} />

              <Typography
                color={isInRed ? 'error' : 'primary'}
                style={{
                  marginLeft: '20px',
                  textAlign: 'center',
                  minWidth: '50px',
                  fontWeight: isInRed && 'bold'
                }}
              >
                £{this.playerBalance(player)}
              </Typography>
            </ListItem>
          );
        })
      ) : (
        <Toolbar style={{ paddingLeft: '0' }}>
          <Typography variant="h6">No players</Typography>
        </Toolbar>
      );

    const manifesto = players.filter(player => player.userType === 'MANIFESTO');
    const contractors = players.filter(
      player => player.userType === 'CONTRACTOR'
    );
    const ringers = players.filter(player => player.userType === 'RINGER');

    return (
      <div style={{ width: '100%', marginBottom: '140px' }}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Manifestonian" />
            <Tab label="Contractor" />
            <Tab label="Ringer" />
            <Tab
              style={{ marginLeft: 'auto', minWidth: '100px' }}
              label="Balance"
              icon={
                sortOrder === 'DESC' ? (
                  <ArrowDownward
                    style={{ fontSize: '1em', marginLeft: '5px' }}
                  />
                ) : (
                  <ArrowUpward style={{ fontSize: '1em', marginLeft: '5px' }} />
                )
              }
            />
          </Tabs>
        </AppBar>
        {value === 0 && <List>{playerList(manifesto)}</List>}
        {value === 1 && <List>{playerList(contractors)}</List>}
        {value === 2 && <List>{playerList(ringers)}</List>}
      </div>
    );
  }
}
export default PlayersList;
