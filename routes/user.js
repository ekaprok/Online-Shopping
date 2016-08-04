// Manage the registration/login process
var router = require('express').Router();
var User = require('../models/user');
var Cart = require('../models/cart');
var passport = require('passport');
var passportConf = require('../config/passport');
var async = require('async');


router.get('/login', function(req, res) {
  if (req.user) return res.redirect('/'); // if the user is logged in, simply redirect to the home page
  res.render('accounts/login', { message: req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile', // if login is successful
  failureRedirect: '/login',
  failureFlash: true // enable the request flash message
}));

router.get('/profile', function(req, res, next) {
  // check if the user id exists or not
  User.findOne({ _id: req.user._id }, function(err, user) {
    if (err) return next(err);

    res.render('accounts/profile', { user: user });

  });


});

router.get('/signup', function(req, res, next) {
  res.render('accounts/signup', { // we use it in signup
    errors: req.flash('errors')
    //user: req.user  -  would have to do it everywhere ...
  }); // specifyy the data for the request
});

router.post('/signup', function(req, res, next) {

  async.waterfall([
    function(callback) {
      var user = new User();

      user.profile.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;
      user.profile.picture = user.gravatar();

      User.findOne({ email: req.body.email }, function(err, existingUser) {

        if (existingUser) {
          req.flash('errors', 'Account with that email address already exists');
          return res.redirect('/signup');
        } else {
          user.save(function(err, user) {
            if (err) return next(err);
            callback(null, user);
          });
        }
      });
    },

    function(user) {
      var cart = new Cart();
      cart.owner = user._id;
      cart.save(function(err) {
        if (err) return next(err);
        req.logIn(user, function(err) {
          if (err) return next(err);
          res.redirect('/profile');
        });
      });
    }
  ]);
});



router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/edit-profile', function(req, res, next) {
  res.render('accounts/edit-profile', { message: req.flash('success')});
});

router.post('/edit-profile', function(req, res, next) {
  User.findOne({ _id: req.user._id }, function(err, user) { // first search for the user

    if (err) return next(err);

    // when a user types smth in the input field, replace
    if (req.body.name) user.profile.name = req.body.name;
    if (req.body.address) user.address = req.body.address;

    user.save(function(err) {
      if (err) return next(err);
      req.flash('success', 'Successfully Edited your profile');
      return res.redirect('/edit-profile');
    });
  });
});

module.exports = router;
