import React, { Component } from 'react';
import Message from '../message';
// Styles
import {
  Button,
  TextField,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select
} from '@material-ui/core';

class OptionsForm extends Component {
  state = {
    koTime: '',
    maxPlayers: '',
    reminderTime: '',
    reminderDay: 3,
    loading: false
  };

  handleChange = e => {
    console.log('change', e);

    const { name: fieldName, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [fieldName]: val });
  };

  componentDidMount() {
    // 1) Get current options
    const { adminOptions } = this.props;
    // 2) If no options saved in DB then don't just render form
    if (adminOptions.data.adminOptions.length < 1) return;
    // 3) Get first in response. There is only ever one
    const storedOptions = adminOptions.data.adminOptions[0];
    let { koTime, maxPlayers, reminderTime, reminderDay } = storedOptions;
    // Incase never set
    koTime = koTime || '';
    maxPlayers = maxPlayers || '';
    reminderTime = reminderTime || '';
    reminderDay = reminderDay || '';
    // 4) Set initial values for form
    this.setState({ koTime, maxPlayers, reminderTime, reminderDay });
  }
  render() {
    const { setAdminOptions } = this.props;
    const { loading, message, error } = this.state;

    return (
      <form
        onSubmit={async e => {
          e.preventDefault();
          this.setState({ loading: true });

          try {
            await setAdminOptions({ variables: { ...this.state } });
            this.setState({
              message: 'Admin options successfully updated',
              error: false,
              loading: false
            });
          } catch (e) {
            this.setState({ message: e.message, error: true });
          }
        }}
      >
        {message && (
          <Message
            text={message}
            variant={error || this.state.error ? 'error' : null}
          />
        )}
        <Typography variant="h4" gutterBottom>
          Set admin options
        </Typography>

        <div>
          <TextField
            type="time"
            id="koTime"
            name="koTime"
            label="Kick off time"
            style={{ marginBottom: '20px', width: '150px' }}
            required
            value={this.state.koTime}
            onChange={this.handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <FormControl>
          <InputLabel htmlFor="reminder-day">Reminder Day</InputLabel>
          <Select
            value={this.state.reminderDay}
            onChange={this.handleChange}
            inputProps={{ name: 'reminderDay', id: 'reminder-day' }}
            style={{ marginBottom: '20px', width: '150px' }}
          >
            <MenuItem value={1}>Monday</MenuItem>
            <MenuItem value={2}>Tuesday</MenuItem>
            <MenuItem value={3}>Wednesday</MenuItem>
            <MenuItem value={4}>Thursday</MenuItem>
            <MenuItem value={5}>Friday</MenuItem>
            <MenuItem value={6}>Saturday</MenuItem>
            <MenuItem value={7}>Sunday</MenuItem>
          </Select>
        </FormControl>
        <div>
          <TextField
            type="time"
            id="reminderTime"
            name="reminderTime"
            label="Reminder Time"
            style={{ marginBottom: '20px', width: '225px' }}
            required
            placeholder="15:00"
            value={this.state.reminderTime}
            onChange={this.handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div>
          <TextField
            type="number"
            id="maxPlayers"
            name="maxPlayers"
            label="Max Players"
            style={{ marginBottom: '20px', width: '150px' }}
            required
            placeholder="15:00"
            value={this.state.maxPlayers}
            onChange={this.handleChange}
            InputLabelProps={{ shrink: true }}
            min={10}
            max={24}
          />
        </div>

        <Button variant={'contained'} color={'primary'} type="submit">
          Submit{loading ? 'ting' : ''}
        </Button>
      </form>
    );
  }
}

export default OptionsForm;
