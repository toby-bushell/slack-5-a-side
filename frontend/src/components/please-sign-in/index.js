import React from 'react';
import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY } from '../user';
import { navigate } from '@reach/router';

const PleaseSignIn = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (!data.me) {
        navigate('sign-in');
      }
      return props.children;
    }}
  </Query>
);

export default PleaseSignIn;
