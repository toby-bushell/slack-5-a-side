import React, { Fragment } from 'react';
import DeletePlayer from './delete-player';
import AddToMatch from './add-to-match';
import RemindPlayer from './remind-player';
import RemoveFromMatch from '../players/remove-from-match';
import { Items, Row, RowHeader } from '../styles/list';

// Material
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const PlayersList = ({
  players,
  notInUpcomingMatch = false,
  removeFromUpcoming = false,
  deletePossible = false,
  matchId = null
}) => (
  <Table style={{ width: '100%' }}>
    {players.length > 0 && (
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
    )}
    <TableBody>
      {players.length > 0 ? (
        players.map(player => (
          <TableRow key={player.id}>
            <TableCell>{player.id}</TableCell>
            <TableCell>{player.name}</TableCell>
            {notInUpcomingMatch && (
              <Fragment>
                <TableCell>
                  <RemindPlayer playerId={player.id} matchId={matchId} />
                </TableCell>

                <TableCell>
                  <AddToMatch playerId={player.id} matchId={matchId} />
                </TableCell>
              </Fragment>
            )}

            {/* {deletePossible && (
                <DeletePlayer id={player.id} matchId={removePossible} />
              )} */}
            {removeFromUpcoming && matchId && (
              <TableCell>
                <RemoveFromMatch playerId={player.id} matchId={matchId} />
              </TableCell>
            )}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell>no players</TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
);

export default PlayersList;
