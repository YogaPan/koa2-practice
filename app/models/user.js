import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    isRequired: true
  },
  password: {
    type: String,
    isRequired: true
  },
  email: {
    type: String,
    isRequired: true
  }
});

UserSchema.methods.cryptPassword = function() {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err)
        return reject(err);

      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err)
          return reject(err);

        this.password = hash;
        resolve();
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

UserSchema.pre('save', async function(next) {
  let users = await UserModel.find({ name: this.name });
  if (users.length !== 0)
    return next(new Error('User exists!'));

  users = await UserModel.find({ email: this.email });
  if (users.length !== 0)
    return next(new Error('Email Exists!'));
});

export default UserModel;
