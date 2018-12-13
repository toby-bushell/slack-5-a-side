import React from 'react';
import PleaseSignIn from '../components/please-sign-in';
import UpcomingMatch from '../components/upcoming-match';
import CreateMatch from '../components/create-match';
import Paper from '@material-ui/core/Paper';

const Home = props => (
  <PleaseSignIn>
    <UpcomingMatch />
    <CreateMatch />
  </PleaseSignIn>
);

export default Home;
