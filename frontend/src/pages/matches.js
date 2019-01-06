import React from 'react';
import PleaseSignIn from '../components/please-sign-in';
import Matches from '../components/matches';

const MatchesPage = props => (
  <PleaseSignIn>
    <Matches />
  </PleaseSignIn>
);

export default MatchesPage;
