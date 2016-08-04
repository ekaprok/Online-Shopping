// Passport is authentication middleware for Node.js.
// Supports authentication using a username and password, Facebook, Twitter.
// Checks if the user is logged in
var passport = require('passport'); // authentication part
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// serialize and deserialize
// It's its job to determine what data from the user object should be stored in the session.
// we store it in connect-mongo
// check the database when the user logs in
passport.serializeUser(function(user, done) {
  done(null, user._id); // we only store an id
});

// So your whole object is retrieved with help of that key.
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


//Middleware == passpoer.authenticate
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) { // validate client's request, email, password ...
  User.findOne({ email: email}, function(err, user) {
    if (err) return done(err); // if an error occured

    if (!user) { // if the user is not found
      return done(null, false, req.flash('loginMessage', 'No user has been found'));
    }

    if (!user.comparePassword(password)) { // compare the pass that a user typed to the one in the database
      return done(null, false, req.flash('loginMessage', 'Oops! Wrong Password pal'));
    }
    // if everything is fine
    return done(null, user);
  });
}));

//custom function to validate
// chech whether a user is logged in or not
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { // if the user logs in
    return next();
  }
  res.redirect('/login'); // if not logged in - redirect to the login page
}
