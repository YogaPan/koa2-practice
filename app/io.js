module.exports = function(io) {
  io.on('connection', socket => {
    io.emit('chat message', 'One user join chatting.');

    socket.on('disconnect', () => {
      io.emit('chat message', 'One user exit.')
    });

    socket.on('chat message', message => {
      io.emit('chat message', message);
    });
  });
}
