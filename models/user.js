// Model the structure of the user (Signup page)
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs'); // for security; makes pass more complicated
var crypto = require('crypto');
var Schema = mongoose.Schema;

/* The user schema attributes / characteristics / fields */
var UserSchema = new Schema({
  // how to store the data
  email: { type: String, unique: true, lowercase: true},
  password: String,

  profile: {
    name: { type: String, default: ''},
    picture: { type: String, default: ''}
  },

  address: String,
  history: [{
    date: Date,
    paid: { type: Number, default: 0},
  }]
});

/*  Hash the password before we even save it to the database */
// pre == "presave" Rewrites the password
UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password'))
    return next();

  bcrypt.genSalt(10, function(err, salt) { // salt is a result of bycrypt
      if (err)
        return next(err);
      bcrypt.hash(user.password, salt, null, function(err, hash) {
          if (err)
            return next(err);
          user.password = hash;
          next();
      });
  });
});

/* compare password in the database and the one that the user type in */
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

// picture
UserSchema.methods.gravatar = function(size) {
  if (!this.size) size = 200;
  if (!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
}


module.exports = mongoose.model('User', UserSchema);
