const cookie = require('cookie');

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
  io.on('connection', socket => {
    // When a new user join chatting.
    count++;
    const username = socket.request.user.username;
    io.emit('join', {
      count,
      username
    });
    console.log(socket.request.user.username);

    // When a user leave this chat.
    socket.on('disconnect', () => {
      count--;
      io.emit('leave', {
        count,
        username
      });
    });

    // When someone say something.
    socket.on('public', message => {
      io.emit('public', {
        username,
        message
      });
    });
  });
}
