import React from 'react';
import PleaseSignIn from '../components/please-sign-in';
import SingleMatch from '../components/single-match';

const Home = ({ id }) => (
  <PleaseSignIn>
    <SingleMatch id={id} />
  </PleaseSignIn>
);

export default Home;
