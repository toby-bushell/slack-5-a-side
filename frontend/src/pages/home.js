import React from 'react';
import PleaseSignIn from '../components/please-sign-in';
import UpcomingMatch from '../components/upcoming-match';

const Home = () => (
  <PleaseSignIn>
    <UpcomingMatch />
  </PleaseSignIn>
);

export default Home;
