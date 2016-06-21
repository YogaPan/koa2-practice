const cookie = require('cookie');
const User = require('./models/user.js');
const Chat = require('./models/chat.js');

module.exports = function(io) {
  // Socket.io middleware.
  io.set('authorization', (data, accept) => {
    if (data.headers.cookie && data.headers.cookie.indexOf('koa:sess') > 1) {
      data.cookie = cookie.parse(data.headers.cookie)['koa:sess'];
      data.user   = JSON.parse(new Buffer(data.cookie, 'base64')).user;
    } else {
      return accept('No cookie transmitted.', false);
    }
    accept(null, true);
  });

  let count = 0;

  // Get client socket and start listening.
  io.on('connection', async socket => {
    // When a new user join chatting.
    count++;
    const user = await User.findById(socket.request.user._id);

    io.emit('join', {
      count,
      username: user.username
    });

    // When a user leave this chat.
    socket.on('disconnect', () => {
      count--;
      io.emit('leave', {
        count,
        username: user.username
      });
    });

    // When someone say something.
    socket.on('public', async message => {
      io.emit('public', {
        username: user.username,
        message
      });

      const newChat = new Chat({
        _creator: user._id,
        message: message
      });
      user.chats.push(newChat._id);

      newChat.save();
      user.save()
    });
  });
};
