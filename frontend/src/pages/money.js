import React from 'react';
import PleaseSignIn from '../components/please-sign-in';
import PlayersMoneyList from '../components/players-money-list';

const AdminOptionsPage = () => (
  <PleaseSignIn>
    <PlayersMoneyList />
  </PleaseSignIn>
);

export default AdminOptionsPage;
