import React from 'react';
import PleaseSignIn from '../components/please-sign-in';
import Players from '../components/players';
import UpdateFromSlack from '../components/update-from-slack';

const Home = props => (
  <PleaseSignIn>
    <UpdateFromSlack />
    <Players />
  </PleaseSignIn>
);

export default Home;
