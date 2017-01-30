import React from 'react';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import * as AuthActions from '../redux/actions/auth';

const Login = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func,
  },

  getInitialState() {
    return { error: false };
  },

  sumbmitForm(e) {
    e.preventDefault();
    const user = {
      username: e.target[0].value,
      password: e.target[1].value
    };
    this.props.dispatch(AuthActions.login(user));
  },

  gotoSignUp() {
    hashHistory.push('/sign-up');
  },

  render() {
    return (
      <div className="login-form">
        <form ref={(c) => {this.form = c;}} onSubmit={this.sumbmitForm}>
          <input type="text" placeholder="username" required />
          <input type="password" placeholder="password" required />
          <button type="button" onClick={this.gotoSignUp}>Sign Up</button>
          <button type="submit">Login</button>
        </form>
        <div className={this.state.error ? 'error-box' : 'hidden'}>
          There was an error.
        </div>
      </div>
    );
  }
});

export default connect(
  state => ({})
)(Login);