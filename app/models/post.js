import mongoose from 'mongoose';

const PostSchema = mongoose.Schema({
  // TODO
  username: {

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
},{
  timestamps: true
});

// TODO
PostSchema.methods.test = function() {

}

const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
