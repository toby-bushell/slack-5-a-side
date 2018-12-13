import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
// import { Items, Row, RowHeader } from '../styles/list';
import { formatToDay } from '../../utils/format-time';
import DeleteMatch from './delete-match';
import { Link } from '@reach/router';

import PlayersList from '../players/players-list';
import moment from 'moment';

// Material
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

const PLAYERS_NOT_IN_MATCH = gql`
  query PLAYERS_NOT_IN_MATCH($matchId: ID!) {
    players(where: { matchesPlayed_every: { id_not: $matchId } }) {
      id
      userType
      name
      slackId
      matchesPlayed {
        id
      }
    }
  }
`;

class Match extends Component {
  render() {
    const { match } = this.props;
    return (
      <Fragment>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Upcoming Match
            </Typography>
            {/* <TableCell>{match.id}</TableCell> */}
            <Typography variant="h6" id="tableTitle">
              {formatToDay(match.time)}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="outlined"
              component={Link}
              to={`/match/${match.id}`}
            >
              Edit Match
            </Button>
          </CardActions>
        </Card>
        <Toolbar>
          <Typography variant="h6" id="tableTitle">
            Players playing
          </Typography>
        </Toolbar>
        <PlayersList
          matchId={match.id}
          removeFromUpcoming={true}
          players={match.players}
        />

        <Query query={PLAYERS_NOT_IN_MATCH} variables={{ matchId: match.id }}>
          {({ data, error, loading }) => {
            console.log('loading', loading, data);
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;

            return (
              <Fragment>
                <Toolbar>
                  <Typography variant="h6" id="tableTitle">
                    Potential players
                  </Typography>
                </Toolbar>
                <PlayersList
                  players={data.players}
                  matchId={match.id}
                  notInUpcomingMatch={true}
                />
              </Fragment>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

export default Match;
export { PLAYERS_NOT_IN_MATCH };
