var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var fs = require('fs');
var Account = require('../models/account.js');
var Food = require('../models/Type.js');
var router = express.Router();
var app = express();
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var flash = require('express-flash');
var busboy = require('connect-busboy');
var multer  =   require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads')
  },
  filename: function (req, file, callback) {
    var datetimestamp = Date.now();
    callback(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});
var upload = multer({ storage : storage }).single('file');

router.get('/foodTypes', function(req,res,next){
  Food.find(function(err,favs){
    if(err)return next(err);
    res.json(favs);
  });
  /*Account.find().select('Foods').exec(function(err,foodType){
    if(err)return next(err);
    res.json(foodType);
  });*/
});

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
    formTitle: 'Welcome',
    username: 'Username',
    password: 'Password',
    Login: 'Login',
    message: '',
    sent: '',
    success: req.flash('success'),
    thumb: ''
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
        message : 'Username or Password Are Incorrect. Please Try Again.',
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
    req.session.destroy();
    req.logout();
    res.redirect('/login');
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
    favorites: 'Set Favorites',
    message: req.flash('error')
  });
});

/*
router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});
*/

router.post('/signUp', function(req, res) {
    Account.register(new Account({
      username : req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      emailAddress: req.body.email,
      userPhoto: req.body.userPhoto,
      password: req.body.password
    }), req.body.password, function(err, account) {

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
              favorites: 'Set Favorites',
              message: ''
            });
        }

        passport.authenticate('local')(req, res, function () {
            //res.redirect('/login');
            res.render('pages/login', {
              user: req.user,
              title: 'Please Login',
              formTitle: 'Welcome ' + req.user.username,
              username: 'Username',
              password: 'Password',
              Login: 'Login',
              message: '',
              sent: '',
              success: req.flash('success'),
              thumb: ''
            });
        });
    });
});

router.get('/budget', function(req, res) {
  res.render('pages/budget', {
    title: 'Hungry?',
    budgetTitle: 'Food Finder',
    budget: 'Enter Budget Below',
    placeholder: '($)',
    find: 'Find Food',
    userBudget: req.cookies.budget,
    moneyOnly: "Silly "+req.user.username+". You can't pay with words.",
    fullName: req.user.firstname + ' ' + req.user.lastname,
    userName: req.user.username,
    favorites: req.flash('favorites')
  });
});

router.get('/forgetMemory', function(req, res){
  res.clearCookie('budget');
  res.clearCookie('options');
  res.redirect('/');
});

router.post('/restaurants', function(req,res,err) {
  var minute = 60 * 1000;
  if (req.body.budget) res.cookie('budget', 1, { maxAge: minute });
  //if (req.body.options.value) res.cookie('options', 1, { maxAge: minute });
  res.render('pages/restaurants', {
    title: 'Restaurants',
    subTitle: "What's on the menu today "+req.user.username+"?",
    budget: "I see you have $"+req.body.budget+" in your pocket?",
    fullName: req.user.firstname + ' ' + req.user.lastname,
    userName: req.user.username
  });
});

router.get('/forgotPass',function(req,res){
  res.render('pages/forgotPass',{
    user: req.user,
    title: 'Forget Password?',
    subTitle: 'Enter This Accounts Email',
    fullName: req.user.firstname + ' ' + req.user.lastname,
    userName: req.user.username
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
  Account.findOne({
    resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgotPass');
    }
    res.render('pages/reset', {
      user: req.user,
      title: 'Reset Password',
      //currentPass: user.password,
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

        //user.hash = req.body.password;
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
    profileUpdated: req.flash('profileUpdated'),
    deleted: req.flash('deleted')
  });
});

router.get('/settings',function(req,res){
  res.render('pages/settings',{
    user: req.user,
    title: 'Settings',
    updateBio: 'Update Profile',
    reset: 'Reset Password',
    picture: 'Change Profile Picture',
    favorite: 'Update Favorites',
    remove: 'Delete Account'
  });
});

router.get('/profilePicture',function(req,res){
  res.render('pages/profilePic',{
    title: 'Profile Picture',
    user: req.user.username,
    profilePic: 'Upload a Profile Picture ',
    fullName: req.user.firstname + ' ' + req.user.lastname,
    userName: req.user.username,
    noUpload: req.flash('uploadError'),
    goodUpload: req.flash('goodUpload'),
  });
});

router.post('/profilePicture',function(req,res){
  upload(req,res,function(err){
    if(err){
      req.flash('uploadError', 'So sorry, profile picture did not upload, please try again.');
      return res.redirect('/profilePicture');
    }
    req.flash('goodUpload', 'Your profile picture has been uploaded. Check it Out');
    res.redirect('/profilePicture');
  });
});

router.get('/updateProfile',function(req,res){
  res.render('pages/profileUpdate',{
    title: 'Your Profile',
    update: 'Update Your Profile ' + req.user.username,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    username: req.user.username,
    emailAddress: req.user.emailAddress,
    fullName: req.user.firstname + ' ' + req.user.lastname,
    userName: req.user.username
  });
});

router.post('/updateProfile',function(req,res){
  Account.findById({ _id: req.user.id }, function(err,account){
    if(err) throw err;

    account.firstname = req.body.firstname;
    account.lastname = req.body.lastname;
    account.username = req.body.username;
    account.emailAddress = req.body.email;
    //account.userPhoto.contentType = req.body.userPhoto;
    //account.set('userPhoto.file', req.body.userPhoto);

    account.save(function(err){
      if(err){
        console.log('shit went wrong');
      }else{
        req.flash('profileUpdated', 'Your Profile has been Updated!');
        res.redirect('/message');
      }
    });
  });
});

router.get('/favorites',function(req,res){
  res.render('pages/favorites',{
    user: req.user,
    username: req.user.username,
    title:'Favorites',
    fullName: req.user.firstname + ' ' + req.user.lastname,
    userName: req.user.username,
    yourFavs: req.user.Foods.Type,
    favsError: req.flash('favsError')
  });
});

router.post('/favorites',function(req,res){
  Account.findById({ _id: req.user.id },{Favorite:true}, function(err,account){
    if(err) throw err;

    account.Foods.Favorite = true;
    account.Foods.Type = req.body.favorites;

    account.save(function(err){
      if(err){
        req.flash('favsError', 'Sorry, Could Not Save Your Favorites, Try Again.');
        return res.redirect('/favorites');
      }else{
        req.flash('favorites',"Your favorites have been saved. Eat what you want!");
        res.redirect('/budget');
      }
    });
  });
});//this WILL be used. each food item has an ID

router.get('/deleteProfile',function(req,res){
  res.render('pages/deleteProfile',{
    user: req.user.username,
    title: 'Delete Account',
    fullName: req.user.firstname + ' ' + req.user.lastname,
    userName: req.user.username
  });
});

router.post('/deleteProfile',function(req,res){
  Account.findByIdAndRemove({ _id: req.user.id }, function(err, account){
    if(err) throw err;
    req.flash('deleted', 'Your Account has been Deleted... Goodbye.');
    res.redirect('/message');
  });
});

module.exports = router;