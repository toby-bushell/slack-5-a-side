import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { client } from './lib/client';
import UpcomingMatch from './components/upcoming-match';
import PastMatches from './components/past-matches';
import SingleMatch from './components/single-match';
import Players from './components/players';
import Home from './pages/home';
import AdminOptions from './components/admin-options';
import Nav from './components/nav';
import CreatePlayer from './components/create-player';
import SignIn from './components/sign-in';
import UpdateFromSlack from './components/update-from-slack';
import { Router } from '@reach/router';
import 'react-accessible-accordion/dist/minimal-example.css';
import ErrorBoundary from './components/error-boundary';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ApolloProvider client={client}>
          <ErrorBoundary>
            <Grid container>
              <Grid item xs={2}>
                <Nav />
              </Grid>
              <Grid item xs={10}>
                <AppBar position="relative">
                  <Toolbar>Manifesto</Toolbar>
                </AppBar>
                <div style={{ paddingTop: '60px', paddingRight: '20px' }}>
                  <Router>
                    <Home path="/" />
                    <SignIn path="/sign-in" />
                    <Players path="/players" />
                    <UpcomingMatch path="/upcoming-match" />
                    <PastMatches path="/past-matches" />
                    <SingleMatch path="/match/:id" />
                    <CreatePlayer path="/create-player/" />
                    <UpdateFromSlack path="/update-from-slack" />
                    <AdminOptions path="/admin/options" />
                  </Router>
                </div>
              </Grid>
            </Grid>
          </ErrorBoundary>
        </ApolloProvider>
      </div>
    );
  }
}
export default App;
