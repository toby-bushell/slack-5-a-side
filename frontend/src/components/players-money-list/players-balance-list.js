import React, { Component } from 'react';
import SlackAvatar from '../slack-avatar';
import { getPlayerBalance, amountColours } from './utils';
// Material
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Toolbar
} from '@material-ui/core';

import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import PlayerBalanceSummary from './player-balance-summary';
import { theme } from '../../theme';

class PlayersList extends Component {
  state = {
    value: 0,
    sortOrder: 'DESC',
    activePlayerId: null,
    modalOpen: false
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

  updateSortOrder = async () => {
    const { sortOrder } = this.state;

    if (sortOrder === 'DESC') {
      this.setState({ sortOrder: 'ASC' }, () => true);
    } else {
      this.setState({ sortOrder: 'DESC' }, () => true);
    }
  };
  comparePlayers = (a, b) => {
    if (getPlayerBalance(a) < getPlayerBalance(b)) return -1;
    if (getPlayerBalance(a) > getPlayerBalance(b)) return 1;
    return 0;
  };

  sortByBalance = () => {
    const { sortOrder } = this.state;
    const { players } = this.props;
    let sortedPlayers = [...this.props.players];

    console.log('sortedPlayers', sortedPlayers);

    if (sortOrder === 'DESC') {
      sortedPlayers = [...players].sort((a, b) => {
        if (getPlayerBalance(a) < getPlayerBalance(b)) return -1;
        if (getPlayerBalance(a) > getPlayerBalance(b)) return 1;
        return 0;
      });
    } else {
      sortedPlayers = [...players].sort((a, b) => {
        if (getPlayerBalance(a) > getPlayerBalance(b)) return -1;
        if (getPlayerBalance(a) < getPlayerBalance(b)) return 1;
        return 0;
      });
    }
    return sortedPlayers;
  };

  handlePlayerClick = player => {
    if (this.state.activePlayer && player.id === this.state.activePlayer.id) {
      this.setState({
        activePlayerId: null,
        modalOpen: false
      });
    } else {
      this.setState({
        activePlayerId: player.id,
        modalOpen: true
      });
    }
  };

  render() {
    const { value, sortOrder } = this.state;
    let { players } = this.props;

    players = this.sortByBalance();

    const playerList = items =>
      items.length > 0 ? (
        items.map(player => {
          const isInRed = getPlayerBalance(player) < 0;

          return (
            <ListItem
              key={player.id}
              onClick={() => this.handlePlayerClick(player)}
            >
              <ListItemAvatar>
                <SlackAvatar player={player} />
              </ListItemAvatar>
              <ListItemText primary={player.name} />

              <Typography
                style={{
                  marginLeft: theme.spacing,
                  textAlign: 'center',
                  minWidth: '50px',
                  fontWeight: isInRed && 'bold',
                  color: amountColours(getPlayerBalance(player))
                }}
              >
                £{getPlayerBalance(player)}
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
                  <ArrowDownward style={{ fontSize: '1', marginLeft: '5px' }} />
                ) : (
                  <ArrowUpward style={{ fontSize: '1', marginLeft: '5px' }} />
                )
              }
            />
          </Tabs>
        </AppBar>
        {value === 0 && <List>{playerList(manifesto)}</List>}
        {value === 1 && <List>{playerList(contractors)}</List>}
        {value === 2 && <List>{playerList(ringers)}</List>}
        <PlayerBalanceSummary
          open={this.state.modalOpen}
          activePlayerId={this.state.activePlayerId}
          players={this.props.players}
          onClose={player => this.handlePlayerClick(player)}
        />
      </div>
    );
  }
}
export default PlayersList;
