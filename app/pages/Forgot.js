import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as AuthActions from '../redux/actions/auth';

class Forgot extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '' };
  }

  submitForm(e) {
    e.preventDefault();
    const email = e.target[0].value;
    this.props.dispatch(
      AuthActions.forgotPassword(email)
    );
  }

  handleChange(e) {
    const newState = { [e.target.dataset.key]: e.target.value };
    this.setState(newState);
  }

  render() {
    return (
      <div className="login-form">
        <form onSubmit={(e) => this.submitForm(e)}>
          <input
            type="email"
            placeholder="Email"
            data-key="email"
            value={this.state.email}
            onChange={(e) => this.handleChange(e)}
          />
          <br />
          <button type="submit">Reset Password</button>
        </form>
        <div className={this.props.error ? 'error-box' : 'hidden'}>
          { this.props.error }
        </div>
      </div>
    );
  }
}

Forgot.propTypes = {
  error: PropTypes.string,
  dispatch: PropTypes.func,
};

export default connect(
  (state) => ({
    error: state.auth.error,
  })
)(Forgot);
