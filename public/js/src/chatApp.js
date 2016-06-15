import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';

const socket = io();

class ChatApp extends Component {
  constructor(...args) {
    super(...args);
  }

  render() {
    return (
      <div>
        <p>chatApp</p>
      </div>
    );
  }
}

render(
  <ChatApp />,
  document.getElementById('chatApp')
);
