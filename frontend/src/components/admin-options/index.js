import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import OptionsFrom from './options-form';
import { theme } from '../../theme';
// Material
import { Grid } from '@material-ui/core';

const ADMIN_OPTIONS = gql`
  query ADMIN_OPTIONS {
    adminOptions {
      id
      koTime
      maxPlayers
      reminderTime
      reminderDay
    }
  }
`;

const SET_ADMIN_OPTIONS = gql`
  mutation setAdmin(
    $koTime: DateTime!
    $maxPlayers: Int!
    $reminderTime: DateTime!
    $reminderDay: Int!
  ) {
    setAdminOptions(
      koTime: $koTime
      maxPlayers: $maxPlayers
      reminderTime: $reminderTime
      reminderDay: $reminderDay
    ) {
      koTime
      maxPlayers
      reminderTime
      reminderDay
    }
  }
`;
/* eslint-disable */
const Composed = adopt({
  adminOptions: ({ render }) => <Query query={ADMIN_OPTIONS}>{render}</Query>,
  setAdminOptions: ({ render }) => (
    <Mutation mutation={SET_ADMIN_OPTIONS}>{render}</Mutation>
  )
});
/* eslint-enable */

const styles = {
  display: 'flex',
  padding: `0 ${theme.toolbarPadding}`,
  marginBottom: theme.largeSpacing,
  flexWrap: 'wrap'
};

class AdminOptions extends Component {
  render() {
    return (
      <Composed>
        {({ adminOptions, setAdminOptions }) => {
          if (adminOptions.loading) return <p>Loading ...</p>;
          if (adminOptions.error)
            return <p>Error: {adminOptions.error.message}</p>;

          return (
            <Grid item xs={12} spacing={16} container style={styles}>
              <OptionsFrom
                adminOptions={adminOptions}
                setAdminOptions={setAdminOptions}
              />
            </Grid>
          );
        }}
      </Composed>
    );
  }
}

export default AdminOptions;
export { ADMIN_OPTIONS };
