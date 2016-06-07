import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import 'whatwg-fetch';

const POST_FAIL = 'POST_FAIL';
const POST_SUCCESS = 'POST_SUCCESS';

function postFail(errorMessage) {
  return {
    type: POST_FAIL,
    errorMessage
  };
}

function postSuccess() {
  return {
    type: POST_SUCCESS,
  };
}

const initialState = {
  errorMessage: ''
};

function postReducer(state = initialState, action = {}) {
  switch (action.type) {
    case POST_FAIL:
      return Object.assign({}, state, {
        errorMessage: action.errorMessage
      });
    case POST_SUCCESS:
      return Object.assign({}, state, {
        errorMessage: ''
      });
    default:
      return state;
  }
}

const store = createStore(postReducer);

class PostApp extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const { errorMessage } = this.props;

    return (
      <form id="postForm" method="POST" onSubmit={this.handleSubmit}>
        <h1>{errorMessage}</h1>
        Title: <input type="text" ref="title" /><br/>
        Content: <input type="text" ref="content" /><br/>
        <button type="submit">Post</button>
      </form>
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    const { postSuccess, postFail } = this.props.actions;

    const titleNode = this.refs.title;
    const contentNode = this.refs.content;

    const title = titleNode.value;
    const content = contentNode.value;

    if (title === '')
      return postFail('No title');
    if (content === '')
      return postFail('No content');

    titleNode.value = '';
    contentNode.value = '';

    fetch('/posts/', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        content
      })
    }).then((response) => response.json())
      .then((response) => {
        if (response.success) {
          return postSuccess();
        } else {
          return postFail(response.errorMessage);
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
      postFail,
      postSuccess
    }, dispatch)
  };
}

PostApp = connect(mapStateToProps, mapDispatchToProps)(PostApp);

render(
  <Provider store={store}>
    <PostApp />
  </Provider>,
  document.getElementById('postApp')
);
