import React from 'react';
import Player from './player';
// Material
import { Grid, Toolbar, Typography } from '@material-ui/core';

const ChipList = ({ players, matchId }) => {
  return (
    <Grid
      item
      xs={12}
      container
      spacing={16}
      style={{
        display: 'flex',
        padding: '0 14px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}
    >
      {players.length > 0 ? (
        players.map(player => {
          return <Player key={player.id} player={player} matchId={matchId} />;
        })
      ) : (
        <Toolbar style={{ paddingLeft: '0' }}>
          <Typography color="secondary">No players yet</Typography>
        </Toolbar>
      )}
    </Grid>
  );
};

export default ChipList;
