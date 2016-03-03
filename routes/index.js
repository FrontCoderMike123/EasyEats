var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var Account = require('../models/account.js');
var Food = require('../models/Type.js');
var router = express.Router();
var app = express();
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var flash = require('express-flash');
var multer  =   require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/images/profilePictures');
  },
  filename: function (req, file, callback) {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth()+1;
    var year = today.getFullYear();
    callback(null, file.fieldname + '-' + day + '-' + month + '-' + year);
  }
});
var upload = multer({ storage : storage}).single('userPhoto');

router.get('/foodTypes', function(req,res,next){
  /*Account.find().select('Foods').exec(function(err,foodType){
    if(err)return next(err);
    res.json(foodType);
  });*/
  Food.find(function(err,foodType){
    if(err)return next(err);
    res.json(foodType);
  });
});

router.get('/favorites',function(req,res){
  res.render('pages/favorites',{
    user: req.user,
    username: req.user.username,
    title:'Favorites'
  });
});

router.post('/favorites',function(req,res){
  req.flash('favorites',"Your favorites have been saved. Eat what you want!");
  res.redirect('/message');
});//this WILL be used. each food item has an ID

router.get('/', function (req, res) {
    res.render('pages/index', {
      user : req.user,
      title: 'Welcome to EasyEatz!',
      subTitle: 'New or Not?'
    });
});

router.get('/login', function(req,res,next) {
  res.render('pages/login', {
    user: req.user,
    title: 'Please Login',
    formTitle: 'Welcome Back',
    username: 'Username',
    password: 'Password',
    Login: 'Login',
    message: '',
    sent: '',
    success: req.flash('success')
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (! user) {
      return res.render('pages/login',{
        user: req.user,
        title: 'Please Login',
        formTitle: 'Welcome Back',
        username: 'Username',
        password: 'Password',
        Login: 'Login',
        message : 'Username or Password Incorrect. Please Try Again.',
        sent: '',
        success: ''
      });
    }
    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      res.redirect('/budget');
    });      
  })(req, res, next);
});

/*router.post('/login', passport.authenticate('local',{
  successRedirect: '/budget',
  failureRedirect: '/login'
}));*/

router.get('/logout', function(req, res) {
    req.logout();
    //res.redirect('/');
    res.render('pages/index',{
      user : req.user,
      title: 'EasyEatz',
      subTitle: 'Come back soon'
    });
});

router.post('/logout', function(req, res){
    res.render('pages/index',{
      user : req.user,
      title: 'EasyEatz',
      subTitle: 'Come back soon '+req.user
    });
});

router.get('/signUp', function(req, res) {
  res.render('pages/signUp', {
    title: 'Register Today',
    signUpTitle: 'Sign Up',
    username: 'Username',
    password: 'Password',
    fname: 'First Name',
    lname: 'Last Name',
    signUp: 'Sign Up',
    info: '',
    email: 'Email Address',
    message: req.flash('error')
  });
});

/*
router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});
*/

router.post('/signUp', function(req, res) {
    Account.register(new Account({ username : req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, emailAddress: req.body.email }), req.body.password, function(err, account) {
        if (err) {
            return res.render("pages/signUp", {
              info: "Sorry. That username already exists. Try again.",
              title: 'Register Today',
              signUpTitle: 'Sign Up',
              username: 'Username',
              password: 'Password',
              fname: 'First Name',
              lname: 'Last Name',
              signUp: 'Sign Up',
              email: 'Email Address',
              message: ''
            });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/login');
        });
    });
});

router.get('/budget', function(req, res) {
  res.render('pages/budget', {
    title: 'Hungry?',
    budgetTitle: 'Food Finder!',
    craving: 'Craving Something?',
    budget: 'Enter Budget',
    placeholder: '($)',
    find: 'Find Food',
    info: "Hello "+req.user.username+". I bet you're feeling hungry.",
    userBudget: req.cookies.budget,
    moneyOnly: "Silly "+req.user.username+". You can't pay with words."
  });
});

router.get('/forgetMemory', function(req, res){
  res.clearCookie('budget');
  res.clearCookie('options');
  res.redirect('/');
});

router.post('/budget', function(req,res,err) {
  var minute = 60 * 1000;
  if (req.body.budget) res.cookie('budget', 1, { maxAge: minute });
  //if (req.body.options.value) res.cookie('options', 1, { maxAge: minute });
  res.render('pages/restaurants', {
    title: 'Restaurants',
    subTitle: "What's on the menu today, "+req.user.username+"?",
    budget: "I see you have $"+req.body.budget+" in your pocket? And you're craving some ?"
  });
});

router.get('/forgotPass',function(req,res){
  res.render('pages/forgotPass',{
    user: req.user,
    title: 'Forget Password?',
    subTitle: 'Enter This Accounts Email'
  });
});

router.post('/forgotPass', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      Account.findOne({ emailAddress: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/signUp');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'Hotmail',
        auth: {
          user: 'michelBeaubien@hotmail.com',
          pass: 'Juggalo69!'
        }
      });
      var mailOptions = {
        to: user.emailAddress,
        from: 'passwordreset@demo.com',
        subject: 'Easy Eats Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info',
          'Hey ' + user.username + '! A reset link has been sent to ' + user.emailAddress + '.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/message');
  });
});

router.get('/reset/:token', function(req, res) {
  Account.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgotPass');
    }
    res.render('pages/reset', {
      user: req.user,
      title: 'Reset Password',
      currentPass: user.password,
      error: req.flash('error')
    });
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      Account.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('/');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'Hotmail',
        auth: {
          user: 'michelBeaubien@hotmail.com',
          pass: 'Juggalo69!'
        }
      });
      var mailOptions = {
        to: user.emailAddress,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,'+ user.firstname +'\n\n' +
          'This is a confirmation that the password for your account ' + user.emailAddress + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/login');
  });
});

router.get('/message',function(req,res){
  res.render('pages/messages',{
    title: 'Messages',
    sent: req.flash('info'),
    noUpload: req.flash('uploadError'),
    goodUpload: req.flash('goodUpload'),
    favorites: req.flash('favorites'),
    userPic: req.body.userPhoto
  });
});

router.get('/settings',function(req,res){
  res.render('pages/settings',{
    user: req.user,
    title: 'Settings',
    updateBio: 'Update Profile Information',
    reset: 'Reset / Forgot Password',
    picture: 'Change Profile Picture',
    favorite: 'Different Favorites'
  });
});

router.get('/profilePicture',function(req,res){
  res.render('pages/profilePic',{
    title: 'Profile Picture',
    user: req.user.username,
    profilePic: 'Upload a Profile Picture '
  });
});

router.post('/profilePicture',function(req,res){
  upload(req,res,function(err) {
    var today = new Date();
    var year = today.getFullYear();
    if(err || req.body.userPhoto) {
      console.log(req.body.userPhoto);
      req.flash('uploadError', 'So sorry, profile picture did not upload, please try again.');
      return res.redirect('/message');
    }
    req.flash('goodUpload', 'Your profile picture has been uploaded. Check it Out');
    res.redirect('/message');
  });
});

module.exports = router;