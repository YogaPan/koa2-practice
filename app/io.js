let count = 0;

module.exports = function(io) {
  // Get client socket and start listening.
  io.on('connection', socket => {
    // When a new user join chatting.
    count++;
    io.emit('join', count);

    // When a user leave this chat.
    socket.on('disconnect', () => {
      count--;
      io.emit('leave', count);
    });

    // When someone say something.
    socket.on('public', message => {
      io.emit('public', message);
    });
  });
}
