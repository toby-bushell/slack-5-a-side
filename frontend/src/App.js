import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { client } from './lib/client';
import PastMatches from './components/past-matches';
import Players from './pages/players';
import MatchesPage from './pages/matches';
import Home from './pages/home';
import SingleMatch from './pages/single-match';
import AdminOptions from './pages/admin-options';
import MoneyPage from './pages/money';
import Nav from './components/nav';
import CreateRinger from './pages/create-ringer';
import SignIn from './components/sign-in';
import UpdateFromSlack from './components/update-from-slack';
import { Router } from '@reach/router';
import 'react-accessible-accordion/dist/minimal-example.css';
import ErrorBoundary from './components/error-boundary';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import './App.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#231f20' },
    secondary: { main: '#ff0060' }
  },
  typography: { useNextVariants: true }
});

class App extends Component {
  render() {
    return (
      <div className="App">
        <ApolloProvider client={client}>
          <ErrorBoundary>
            <MuiThemeProvider theme={theme}>
              <Grid container>
                <Grid item xs={2} style={{ minHeight: '100vh' }}>
                  <Nav />
                </Grid>
                <Grid item xs={10}>
                  <AppBar position="relative">
                    <Toolbar>Manifesto</Toolbar>
                  </AppBar>
                  <div style={{ padding: '60px 20px 20px' }}>
                    <Router>
                      <Home path="/" />
                      <SignIn path="/sign-in" />
                      <Players path="/players" />
                      <MatchesPage path="/matches" />
                      <PastMatches path="/past-matches" />
                      <SingleMatch path="/match/:id" />
                      <CreateRinger path="/create-ringer/" />
                      <UpdateFromSlack path="/update-from-slack" />
                      <AdminOptions path="/admin-options" />
                      <MoneyPage path="/money" />
                    </Router>
                  </div>
                </Grid>
              </Grid>
            </MuiThemeProvider>
          </ErrorBoundary>
        </ApolloProvider>
      </div>
    );
  }
}
export default App;
