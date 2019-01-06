import React from 'react';
import PleaseSignIn from '../components/please-sign-in';
import CreateRinger from '../components/create-ringer';

const CreateRingerPage = props => (
  <PleaseSignIn>
    <CreateRinger />
  </PleaseSignIn>
);

export default CreateRingerPage;
