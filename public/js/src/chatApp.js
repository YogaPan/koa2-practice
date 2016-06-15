import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';

// Socket io
const socket = io();

// Action Types.
const MESSAGE_RECIEVE = 'MESSAGE_RECIEVE';

// Action Creators.
function messageRecieve(message) {
  return {
    type: MESSAGE_RECIEVE,
    message
  };
}

const initialState = {
  messages: []
};

// Reducer
function chatReducer(state = initialState, action = {}) {
  switch (action.type) {
    case MESSAGE_RECIEVE:
      return Object.assign({}, state, {
        messages: state.messages.concat(action.message)
      });
    default:
      return state;
  }
}

// Store
const chatStore = createStore(chatReducer);

class MessageItem extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired
  }

  constructor(...args) {
    super(...args);
  }

  render() {
    const { message } = this.props;

    return (
      <p>{message}</p>
    );
  }
}

class MessageList extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  };

  constructor(...args) {
    super(...args);
  }

  render() {
    const { messages } = this.props;
    const messageElements = messages.map((message, idx) => (
      <li key={idx}>
        <MessageItem message={message} />
      </li>
    ));
    return (
      <ul>
        {messageElements}
      </ul>
    );
  }
}

class ChatForm extends Component {
  static propTypes = {};

  constructor(...args) {
    super(...args);
  }

  render() {
    return (
      <form onSubmit={::this.handleSubmit}>
        <input type="text" ref="message" /><br />
        <button type="submit">Send Message</button>
      </form>
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    const messageNode = this.refs.message;
    const message = messageNode.value;

    socket.emit('chat message', message);

    messageNode.value = '';
  }
}


class ChatApp extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    messageRecieve: PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);
  }

  componentDidMount() {
    const { messageRecieve } = this.props.actions;

    socket.on('chat message', (message) => {
      messageRecieve(message);
    });
  }

  render() {
    const { messages } = this.props;
    return (
      <div>
        <h1>chatApp</h1>
        <MessageList messages={messages} />
        <ChatForm />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    messages: state.messages
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      messageRecieve
    }, dispatch)
  };
}

ChatApp = connect(mapStateToProps, mapDispatchToProps)(ChatApp);

render(
  <Provider store={chatStore}>
    <ChatApp />
  </Provider>,
  document.getElementById('chatApp')
);
