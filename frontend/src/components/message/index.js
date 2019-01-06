import React from 'react';
import { IconButton, Snackbar, SnackbarContent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withTheme } from '@material-ui/core/styles';

class Message extends React.Component {
  state = {
    open: true
  };

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };
  variantStyles = variant => {
    console.log('variant', variant, this.props);

    switch (variant) {
      case 'error':
        return { backgroundColor: '#d32f2f' };
      default:
        break;
    }
  };

  render() {
    const { text, variant } = this.props;

    if (!text || text.length < 1) return null;

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={this.state.open}
        autoHideDuration={6000}
        onClose={this.handleClose}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
      >
        <SnackbarContent
          message={<span id="message-id">{text}</span>}
          style={this.variantStyles(variant)}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </Snackbar>
    );
  }
}

export default withTheme()(Message);
