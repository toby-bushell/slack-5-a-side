import React, { Fragment, Component } from 'react';
import { getPlayerBalance, amountColours } from './utils';
import moment from 'moment';
import ReactToPrint from 'react-to-print';
import DeletePayment from './delete-payment';

// Material
import {
  Modal,
  Typography,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button
} from '@material-ui/core';
import PrintIcon from '@material-ui/icons/Print';
import { theme } from '../../theme';

const modalStyles = {
  padding: '40px',
  position: 'absolute',
  width: '500px',
  maxWidth: '100%',
  backgroundColor: 'white',
  outline: 'none',
  top: `50%`,
  left: `50%`,
  transform: `translate(-50%, -50%)`
};

class PlayerBalanceSummary extends Component {
  render() {
    const { players, activePlayerId, onClose, open } = this.props;
    const player = players.find(player => player.id === activePlayerId);

    const orderedMatchesAndPayments = () => {
      const paymentsAndMatches = [...player.matchesPlayed, ...player.payments];
      if (paymentsAndMatches.length < 2) return paymentsAndMatches;

      return [...paymentsAndMatches].sort((a, b) => {
        if (a.time < b.time) return 1;
        if (a.time > b.time) return -1;
        return 0;
      });
    };

    const paymentsList = () => {
      const playerBalance = getPlayerBalance(player);
      if (orderedMatchesAndPayments().length === 0) {
        return (
          <Toolbar style={{ paddingLeft: '0' }}>
            <Typography variant="h6">No previous payments</Typography>
          </Toolbar>
        );
      }

      const transactionType = transaction => {
        return transaction.__typename === 'Payment'
          ? 'Payment'
          : 'Match Played';
      };
      const getTransactionAmount = transaction => {
        return transaction.__typename === 'Payment'
          ? `${transaction.amountPaid > 0 ? '+' : ''}${transaction.amountPaid}`
          : 5;
      };

      const list = orderedMatchesAndPayments().map(transaction => {
        const type = transactionType(transaction);
        const transactionAmount = getTransactionAmount(transaction);
        return (
          <TableRow key={transaction.time}>
            <TableCell align="right" padding="dense">
              {type === 'Payment' && (
                <DeletePayment player={player} transaction={transaction} />
              )}
            </TableCell>
            <TableCell align="right">
              {moment(transaction.time).format('DD/MM/YY')}
            </TableCell>
            <TableCell align="right">{type}</TableCell>
            <TableCell
              align="right"
              style={{
                color: type === 'Payment' && amountColours(transactionAmount)
              }}
            >
              {transactionAmount}
            </TableCell>
          </TableRow>
        );
      });
      const Total = () => (
        <Fragment>
          <TableRow>
            <TableCell style={{ border: 'none' }} />
            <TableCell style={{ border: 'none' }} />
            <TableCell>Subtotal</TableCell>

            <TableCell
              align="right"
              style={{ color: amountColours(playerBalance) }}
            >
              <strong>£ {getPlayerBalance(player)}</strong>
            </TableCell>
          </TableRow>
        </Fragment>
      );
      return (
        <Fragment>
          {list}
          <Total />
        </Fragment>
      );
    };

    if (!player) return null;

    return (
      <Fragment>
        <Modal onClose={() => onClose(activePlayerId)} open={open}>
          <div style={modalStyles}>
            <div ref={el => (this.componentRef = el)}>
              <ReactToPrint
                trigger={() => (
                  <Button
                    href="#"
                    variant="contained"
                    color="secondary"
                    style={{
                      position: 'absolute',
                      top: theme.spacing,
                      right: theme.spacing
                    }}
                  >
                    Print
                    <PrintIcon
                      style={{ marginLeft: '10px', fontSize: '20px' }}
                    />
                  </Button>
                )}
                content={() => this.componentRef}
                pageStyle={{ marginTop: '25em' }}
              />
              <Toolbar style={{ display: 'block' }}>
                <Typography variant="h4">{player.name}</Typography>
                <Typography>Previous transactions</Typography>
              </Toolbar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Amount (£)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{paymentsList()}</TableBody>
              </Table>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default PlayerBalanceSummary;
