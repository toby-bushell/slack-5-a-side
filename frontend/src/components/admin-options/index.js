import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import OptionsFrom from './options-form';

const ADMIN_OPTIONS = gql`
  query ADMIN_OPTIONS {
    adminOptions {
      id
      koTime
      maxPlayers
      reminderTime
    }
  }
`;

const SET_ADMIN_OPTIONS = gql`
  mutation setAdmin(
    $koTime: DateTime!
    $maxPlayers: Int!
    $reminderTime: DateTime!
  ) {
    setAdminOptions(
      koTime: $koTime
      maxPlayers: $maxPlayers
      reminderTime: $reminderTime
    ) {
      koTime
      maxPlayers
      reminderTime
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

class AdminOptions extends Component {
  render() {
    return (
      <div>
        <Composed>
          {({ adminOptions, setAdminOptions }) => {
            if (adminOptions.loading) return <p>Loading ...</p>;
            return (
              <OptionsFrom
                adminOptions={adminOptions}
                setAdminOptions={setAdminOptions}
              />
            );
          }}
        </Composed>
      </div>
    );
  }
}

export default AdminOptions;
export { ADMIN_OPTIONS };
