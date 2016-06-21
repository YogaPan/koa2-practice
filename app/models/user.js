const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema({
  username: { type: String, isRequired: true },
  password: { type: String, isRequired: true },
  email: { type: String, isRequired: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }]
}, {
  timestamps: true
});

UserSchema.methods.cryptPassword = function() {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return reject(err);

      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) return reject(err);

        this.password = hash;
        return resolve();
      });
    });
  });
};

UserSchema.methods.comparePassword = function(userPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(userPassword, this.password, (err, isPasswordMatch) => {
      if (err)
        return reject(err);

      resolve(isPasswordMatch);
    });
  });
};

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
