import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import 'whatwg-fetch';

const REGISTER_FAIL = 'REGISTER_FAIL';

function registerFail(errorMessage) {
  return {
    type: REGISTER_FAIL,
    errorMessage
  };
}

const initialState = {
  errorMessage: ''
};

function registerReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'REGISTER_FAIL':
      return Object.assign({}, state, {
        errorMessage: action.errorMessage
      });
    default:
      return state;
  }
}

const store = createStore(registerReducer);

class RegisterApp extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const { errorMessage } = this.props;

    return (
      <form id="registerForm" method="POST" onSubmit={this.handleSubmit}>
        <h1>{errorMessage}</h1>
        Username: <input type="text" ref="username" /><br/>
        Password: <input type="password" ref="password" /><br/>
        Password Confirm: <input type="password" ref="passwordConfirm" /><br/>
        Email:    <input type="email" ref="email" /><br/>
        <button type="submit">register</button>
      </form>
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    const { registerFail } = this.props.actions;

    const usernameNode = this.refs.username;
    const passwordNode = this.refs.password;
    const passwordConfirmNode = this.refs.passwordConfirm;
    const emailNode    = this.refs.email;

    const username = usernameNode.value;
    const password = passwordNode.value;
    const passwordConfirm = passwordConfirmNode.value;
    const email    = emailNode.value;

    passwordNode.value = '';
    passwordConfirmNode.value = '';

    if (username.length === 0)
      return registerFail('Enter username');
    if (password.length === 0)
      return registerFail('Enter password');
    if (password !== passwordConfirm)
      return registerFail('Confirm your password');
    if (email.length === 0)
      return registerFail('Enter email');

    fetch('/register', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password,
        email
      })
    }).then((response) => response.json())
      .then((response) => {
        console.log(response);
        console.log('test');
        if (response.success) {
          window.location.href = response.redirect;
        } else {
          return registerFail(response.errorMessage);
        }
      });
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.errorMessage
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      registerFail
    }, dispatch)
  };
}

RegisterApp = connect(mapStateToProps, mapDispatchToProps)(RegisterApp);

render(
  <Provider store={store}>
    <RegisterApp />
  </Provider>,
  document.getElementById('registerApp')
);
