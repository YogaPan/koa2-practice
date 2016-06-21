const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
  _creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true }
}, {
  timestamps: true
});

const ChatModel = mongoose.model('Chat', ChatSchema);

module.exports = ChatModel;
