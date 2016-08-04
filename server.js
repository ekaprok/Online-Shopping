
var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
// create a database for storing a session on the server side
// Store every session inside MongoDB
var MongoStore = require('connect-mongo/es5')(session);
var passport = require('passport');


var secret = require('./config/secret');
var User = require('./models/user');
var Category = require('./models/category');

var cartLength = require('./middlewares/middlewares');

var app = express();

mongoose.connect(secret.database, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});

// Middleware
// it now can use public folder
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  // new instance of MobgoStore
  store: new MongoStore({ url: secret.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) { // now every router will have a user obj by default
  res.locals.user = req.user; // have req.user based on seri/deserialized method
  next();
});
app.use(cartLength);
app.use(function(req, res, next) {
  Category.find({}, function(err, categories) { // need to query it first; look for a spec doc in the database
    if(err) return next(err);
    res.locals.categories = categories; // declared a local variable
    next();
  });
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');
var apiRoutes = require('./api/api');

app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use('/api', apiRoutes);

app.listen(secret.port, function(err) {
  if (err) throw err;
  console.log("Server is Running on port " + secret.port);
});
