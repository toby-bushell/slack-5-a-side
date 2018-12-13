import React from 'react';
import { Link } from '@reach/router';

// Material Ui
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';

const Header = () => {
  return (
    <nav>
      <List>
        <Link to="/">
          <ListItem button>
            <ListItemText>Home</ListItemText>
          </ListItem>
        </Link>
        <Link to="players">
          <ListItem button>
            <ListItemText>Players</ListItemText>
          </ListItem>
        </Link>
        <Link to="upcoming-matches">
          <ListItem button>
            <ListItemText>Upcoming Matches</ListItemText>
          </ListItem>
        </Link>
      </List>
    </nav>
  );
};

export default Header;
