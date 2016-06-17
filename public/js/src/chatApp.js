import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';

// Socket io
const socket = io();

// Action Types.
const MESSAGE_RECIEVE = 'MESSAGE_RECIEVE';
const JOIN_CHAT = 'JOIN_CHAT';
const LEAVE_CHAT = 'LEAVE_CHAT';

// Action Creators.
function messageRecieve(message) {
  return {
    type: MESSAGE_RECIEVE,
    message
  };
}

function joinChat(count, message) {
  return {
    type: JOIN_CHAT,
    count,
    message
  };
}

function leaveChat(count, message) {
  return {
    type: LEAVE_CHAT,
    count,
    message
  };
}

const initialState = {
  messages: [],
  count: 0
};

// Reducer
function chatReducer(state = initialState, action = {}) {
  switch (action.type) {
    case MESSAGE_RECIEVE:
      return Object.assign({}, state, {
        messages: state.messages.concat(action.message)
      });
    case JOIN_CHAT:
      return Object.assign({}, state, {
        messages: state.messages.concat(action.message),
        count: action.count
      });
    case LEAVE_CHAT:
      return Object.assign({}, state, {
        messages: state.messages.concat(action.message),
        count: action.count
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

    socket.emit('public', message);

    messageNode.value = '';
  }
}


class ChatApp extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    count: PropTypes.number.isRequired,
    actions: PropTypes.shape({
      messageRecieve: PropTypes.func.isRequired,
      joinChat: PropTypes.func.isRequired,
      leaveChat: PropTypes.func.isRequired
    }).isRequired
  };

  constructor(...args) {
    super(...args);
  }

  componentDidMount() {
    const {
      messageRecieve,
      joinChat,
      leaveChat
    } = this.props.actions;

    socket.on('public', message => {
      messageRecieve(message);
    });

    socket.on('join', count => {
      joinChat(count, 'One User Join this chat!!');
    });

    socket.on('leave', count => {
      leaveChat(count, 'One User leave this chat room.');
    });
  }

  render() {
    const { messages, count } = this.props;
    return (
      <div>
        <h1>chatApp</h1>
        <h2>{count} Users in this chat room. Enjoy!</h2>
        <MessageList messages={messages} />
        <ChatForm />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    messages: state.messages,
    count: state.count
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      messageRecieve,
      joinChat,
      leaveChat
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
