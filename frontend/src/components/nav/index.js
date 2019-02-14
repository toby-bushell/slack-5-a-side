import React from 'react';
import { Link } from '@reach/router';

// Material Ui
import { ListItem, ListItemText, List } from '@material-ui/core';

const Nav = () => (
  <nav style={{ height: '100%', backgroundColor: '#efefef' }}>
    <List>
      <ListItem button component={Link} to="/">
        <ListItemText>Home</ListItemText>
      </ListItem>
      <ListItem button component={Link} to="players">
        <ListItemText>Players</ListItemText>
      </ListItem>
      <ListItem button component={Link} to="matches">
        <ListItemText>Matches</ListItemText>
      </ListItem>
      <ListItem button component={Link} to="create-ringer">
        <ListItemText>Add ringer</ListItemText>
      </ListItem>
      <ListItem button component={Link} to="admin-options">
        <ListItemText>Admin</ListItemText>
      </ListItem>
      <ListItem button component={Link} to="money">
        <ListItemText>Money</ListItemText>
      </ListItem>
    </List>
  </nav>
);

export default Nav;
