var express = require('express');
var passport = require('passport');
var Account = require('../models/account.js');
var router = express.Router();
var app = express();
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var flash = require('express-flash');

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
    message: ''
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
        message : 'Username or Password Incorrect. Please Try Again.'
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
    email: 'Email Address'
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
              email: 'Email Address'
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
  if (req.body.options.value) res.cookie('options', 1, { maxAge: minute });
  res.render('pages/restaurants', {
    title: 'Restaurants',
    subTitle: "What's on the menu today, "+req.user.username+"?",
    budget: "I see you have $"+req.body.budget+" in your pocket? And you're craving some "+req.body.options+"?"
  });
});

router.get('/forgotPass',function(req,res){
  res.render('pages/forgotPass',{
    user: req.user,
    title: 'Forget Password?',
    subTitle: 'Please Enter Your Email'
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
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.emailAddress + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/login');
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
      title: 'Reset Password'
    });
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      Account.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
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
        text: 'Hello,\n\n' +
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

router.get('/changePass', function(req,res,next){
  res.render('pages/changePass',{
    user: req.user,
    title: "Change Password",
    label1: "New Password",
    label2: "Retype Password",
    noMatch: ''
  });
});

router.post('/changePass', function (req,res,next) {

});

module.exports = router;