import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import 'whatwg-fetch';

const LOGIN_FAIL = 'LOGIN_FAIL';

function loginFail(errorMessage) {
  return {
    type: LOGIN_FAIL,
    errorMessage
  };
}

const initialState = {
  errorMessage: ''
};

function loginReducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_FAIL:
      return Object.assign({}, state, {
        errorMessage: action.errorMessage
      });
    default:
      return state;
  }
}

const store = createStore(loginReducer);

class LoginApp extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    errorMessage: PropTypes.string.isRequired
  };

  render() {
    const { errorMessage } = this.props;

    return (
      <form id="loginForm"
        method="POST"
        onSubmit={::this.handleSubmit}
      >
        <h1>{errorMessage}</h1>
        Username: <input type="text" ref="username" /><br/>
        Passsword: <input type="password" ref="password" /><br/>
        <button type="submit">login</button>
      </form>
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    const { loginFail } = this.props.actions;

    const usernameNode = this.refs.username;
    const passwordNode = this.refs.password;

    const username = usernameNode.value;
    const password = passwordNode.value;

    passwordNode.value = '';

    if (username.length === 0)
      return loginFail('Enter Username');
    if (password.length === 0)
      return loginFail('Enter password');

    fetch('/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then((response) => response.json())
      .then((response) => {
        if (response.success) {
          window.location.href = response.redirect;
        } else {
          return loginFail(response.errorMessage);
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
      loginFail
    }, dispatch)
  };
}

LoginApp = connect(mapStateToProps, mapDispatchToProps)(LoginApp);

render(
  <Provider store={store}>
    <LoginApp />
  </Provider>,
  document.getElementById('loginApp')
);
