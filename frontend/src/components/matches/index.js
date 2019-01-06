import React, { Component } from 'react';
import FutureMatches from '../future-matches';
import PastMatches from '../past-matches';
import CreateMatch from '../create-match';

// Material
import { AppBar, Tabs, Tab, Typography } from '@material-ui/core';

class Matches extends Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({
      value
    });
  };
  render() {
    const { value } = this.state;
    return (
      <div>
        <CreateMatch />
        <Typography gutterBottom variant={'h5'}>
          Matches
        </Typography>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Future" />
            <Tab label="Past" />
          </Tabs>
        </AppBar>
        {value === 0 && <FutureMatches />}
        {value === 1 && <PastMatches />}
      </div>
    );
  }
}

export default Matches;
