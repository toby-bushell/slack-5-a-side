import React, { Component } from 'react';
// Styles
import { Form } from '../styles/forms';

class OptionsForm extends Component {
  state = {
    koTime: '',
    maxPlayers: '',
    reminderTime: '',
    loading: false,
    submitted: false
  };

  handleChange = e => {
    const { name: fieldName, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [fieldName]: val });
  };

  componentDidMount() {
    const { adminOptions } = this.props;
    if (adminOptions.data.adminOptions.length < 1) return;
    const storedOptions = adminOptions.data.adminOptions[0]; // Only ever one instance
    let { koTime, maxPlayers, reminderTime } = storedOptions;
    koTime = koTime ? koTime : '';
    maxPlayers = maxPlayers ? maxPlayers : '';
    reminderTime = reminderTime ? reminderTime : '';
    // Set initial values
    this.setState({ koTime, maxPlayers, reminderTime });
  }
  render() {
    const { setAdminOptions } = this.props;
    const { loading, submitted } = this.state;

    return (
      <Form
        data-test="form"
        onSubmit={async e => {
          e.preventDefault();
          this.setState({ loading: true });
          const res = await setAdminOptions({
            variables: { ...this.state }
          });
          this.setState({ loading: false, submitted: true });
          console.log('response', res);
        }}
      >
        <h3>Set Admin Options</h3>
        {submitted && <p>Saved !!!</p>}
        <fieldset
          disabled={setAdminOptions.loading}
          aria-busy={setAdminOptions.loading}
        >
          <label htmlFor="koTime">
            Kick off time
            <input
              type="time"
              id="koTime"
              name="koTime"
              placeholder="17:40"
              min="17:00"
              max="19:00"
              required
              value={this.state.koTime}
              onChange={this.handleChange}
            />
          </label>
          <label htmlFor="reminderTime">
            Reminder Time (day before match)
            <input
              type="time"
              id="reminderTime"
              name="reminderTime"
              placeholder="15:00"
              required
              value={this.state.reminderTime}
              onChange={this.handleChange}
            />
          </label>
          <label htmlFor="maxPlayers">
            Max Players
            <input
              type="number"
              id="maxPlayers"
              name="maxPlayers"
              placeholder="Max Players"
              required
              value={this.state.maxPlayers}
              onChange={this.handleChange}
              min={10}
              max={24}
            />
          </label>
          <button type="submit">Submit{loading ? 'ting' : ''}</button>
        </fieldset>
      </Form>
    );
  }
}

export default OptionsForm;
