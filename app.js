var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var flash = require('express-flash');
var uploads_base = path.join(__dirname, "uploads");
var busboy = require('connect-busboy');
var methodOverride = require('method-override');
var routes = require('./routes/index');
var multer = require('multer');
var fs = require('fs');
var app = express();

app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "http://localhost");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Two app.use below are for image file uploads
app.use(busboy());
app.use(methodOverride()); 

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploads_base));

app.use('/', routes);

// passport config
var Account = require('./models/account.js');
passport.use(new LocalStrategy(function(username, password, done) {
  Account.findOne({ username: username }, function(err, account) {
    if (err) return done(err);
    if (!account) return done(null, false, { message: 'Incorrect username.' });
    account.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, account);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  });
}));

passport.serializeUser(function(account, done) {
  done(null, account.id);
});

passport.deserializeUser(function(id, done) {
  Account.findById(id, function(err, account) {
    done(err, account);
  });
});

mongoose.connect('mongodb://localhost/users', function(err){
  if(err){
    console.log('Connection Issues', err);
  }else{
    console.log('Connected to Users');
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
