import React, { Component, Fragment } from 'react';
import DeletePlayer from './delete-player';
import ChangeUserType from './change-player-type';
import AddToMatch from './add-to-match';
import RemindPlayer from './remind-player';
import RemoveFromMatch from '../players/remove-from-match';
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
    playedOrder: 'DESC'
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
    const { playedOrder } = this.state;

    console.log('playedOrder', playedOrder);

    if (playedOrder === 'DESC') {
      this.setState({ playedOrder: 'ASC' }, () => true);
    } else {
      this.setState({ playedOrder: 'DESC' }, () => true);
    }
  };
  sortByPlayed = () => {
    const { playedOrder } = this.state;
    const { players } = this.props;
    let sortedPlayers = [...this.props.players];
    console.log('sort by played firing', this.state);

    if (playedOrder === 'DESC') {
      sortedPlayers = [...players].sort((a, b) => {
        return 1 - a.matchesPlayed.length - b.matchesPlayed.length;
      });
    } else {
      sortedPlayers = [...players].sort((a, b) => {
        return a.matchesPlayed.length - b.matchesPlayed.length;
      });
    }
    return sortedPlayers;
  };

  render() {
    const {
      notInUpcomingMatch = false,
      removeFromMatch = false,
      deletePossible = false,
      matchId = null,
      playedSort = false,
      remindPossible = true,
      toolbar = true,
      addPossible = true,
      singleMatch = false
    } = this.props;

    const { value, playedOrder } = this.state;
    let { players } = this.props;
    console.log('players', this.state);

    if (playedSort) players = this.sortByPlayed();

    const playerList = items =>
      items.length > 0 ? (
        items.map(player => (
          <ListItem key={player.id}>
            <ListItemAvatar>
              <SlackAvatar player={player} />
            </ListItemAvatar>
            <ListItemText primary={player.name} />

            {playedSort && (
              <Avatar style={{ marginLeft: '20px' }}>
                {player.matchesPlayed.length}
              </Avatar>
            )}
          </ListItem>
        ))
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
        {toolbar && (
          <AppBar position="static">
            <Tabs value={value} onChange={this.handleChange}>
              <Tab label="Manifestonian" />
              <Tab label="Contractor" />
              <Tab label="Ringer" />
              {playedSort && (
                <Tab
                  style={{ marginLeft: 'auto', minWidth: '100px' }}
                  label="Played"
                  icon={
                    playedOrder === 'DESC' ? (
                      <ArrowDownward
                        style={{ fontSize: '1em', marginLeft: '5px' }}
                      />
                    ) : (
                      <ArrowUpward
                        style={{ fontSize: '1em', marginLeft: '5px' }}
                      />
                    )
                  }
                />
              )}
            </Tabs>
          </AppBar>
        )}
        {value === 0 && <List>{playerList(manifesto)}</List>}
        {value === 1 && <List>{playerList(contractors)}</List>}
        {value === 2 && <List>{playerList(ringers)}</List>}
      </div>
    );
  }
}
export default PlayersList;
