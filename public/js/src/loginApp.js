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
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const { errorMessage } = this.props;

    return (
      <form id="loginForm"
            method="POST"
            onSubmit={this.handleSubmit}
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

    const passwordNode = this.refs.password;
    passwordNode.value = '';

    return loginFail('asshole');
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
