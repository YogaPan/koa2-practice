const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// TODO
PostSchema.methods.test = function() {

}

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
