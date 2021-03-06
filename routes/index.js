var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
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
var util = require('util');
//Where the uploaded user images are headed too.
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads/UserPics/');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage }).single('userPhoto');

//Routers!!!!

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
    formTitle: 'Welcome to Easy Eats',
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
  passport.authenticate('local', function(err, account, info) {
    if (err) return next(err)
    if (!account) {
      return res.render('pages/login',{
        user: req.user,
        title: 'Please Login',
        formTitle: 'Something Went Wrong...',
        username: 'Username',
        password: 'Password',
        Login: 'Login',
        message: 'Username or Password are Incorrect. Try Again.',
        sent: '',
        success: ''
      });
    }
    req.logIn(account, function(err) {
      if (err) return next(err);
      return res.redirect('/budget');
    });
  })(req, res, next);
});

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

router.post('/signup', function(req, res) {
  var account = new Account({
      username : req.body.username,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      emailAddress: req.body.email
    });

  account.save(function(err) {
        if (err) {
            return res.render("pages/signUp", {
              info: "Sorry. That username OR email address have already been taken. Try again.",
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
        }else{
          req.logIn(account, function(err) {
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
      }
  });
});

router.get('/budget', function(req, res) {
  var chosen = JSON.stringify(req.user.Foods.Type);
  //this console.log WILL appear undefined, UP UNTIL you select some FAVORITES!!!!!
  console.log(chosen);
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
    favorites: req.flash('favorites'),
    image: req.user.userPhoto.contentType,
    chosen: chosen
  });
});

router.post('/restaurants', function(req,res,err) {
  var minute = 60 * 1000;
  if (req.body.budget) res.cookie('budget', 1, { maxAge: minute });
  res.render('pages/restaurants', {
    title: 'Restaurants',
    subTitle: "What's on the menu today "+req.user.username+"?",
    budget: req.body.budget,
    fullName: req.user.firstname + ' ' + req.user.lastname,
    userName: req.user.username,
    image: req.user.userPhoto.contentType
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

router.get('/profilePicture',function(req,res){
  res.render('pages/profilePic',{
    title: 'Profile Picture',
    user: req.user.username,
    profilePic: 'Upload a Profile Picture ',
    noUpload: req.flash('uploadError')
  });
});

router.post('/profilePicture',function(req,res,next){
  Account.findById({ _id: req.user.id }, function(err,account){
    if(err) throw err;
    upload(req,res,function(err){
    if(err){
      req.flash('uploadError', 'So sorry, profile picture did not upload, please try again.');
      return res.redirect('/profilePicture');
    }else{
        //console.log(account.userPhoto);
        req.flash('goodUpload', 'Your profile picture has been uploaded. Check it Out');
        res.render('pages/confirmProfilePic',{
          title: 'Confirm Picture',
          user: req.user.username,
          profilePic: "How's this picture look ",
          goodUpload: req.flash('goodUpload'),
          image: '/uploads/UserPics/' + req.file.originalname
        });
      }

    account.userPhoto.contentType = '/uploads/UserPics/'+req.file.originalname;
    account.save(function(err){
      if(err){
        req.flash('uploadError', 'So sorry, profile picture did not upload, please try again.');
        return res.redirect('/profilePicture');
      }
    });
  });
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
    remove: 'Delete Account',
    fullName: req.user.firstname + ' ' + req.user.lastname,
    userName: req.user.username,
    image: req.user.userPhoto.contentType
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
    userName: req.user.username,
    image: req.user.userPhoto.contentType,
    error: req.flash('profileError')
  });
});

//This function right here checks to see if there is an existing user by that username
//before the user can UPDATE HES/HERS username! tap on the back!
function userExist(req, res, next) {
  Account.count({username: req.body.username}, function (err, count){
    if (count === 0){
      next();
    }else{
      req.flash('profileError', 'A user by that username already exists, please try again.');
      res.redirect('/updateProfile');
    }
  });
}

//EVEN if you only want to change you name, but not your username. 
//it will still deny you access. THERE is a user in the DB by that name
//its YOU! . so if you do make it to the update page. update everything or nothing is needed.
router.post('/updateProfile',userExist,function(req,res){
  Account.findById({ _id: req.user.id }, function(err,account){
    if(err) throw(err);

    account.firstname = req.body.firstname;
    account.lastname = req.body.lastname;
    account.username = req.body.username;
    account.emailAddress = req.body.email;

    account.save(function(err){
      if(err){
        req.flash('profileError', 'A user by that username already exists, please try again.');
        res.redirect('/updateProfile');
      }else{
        req.flash('profileUpdated', 'Your Profile has been Updated!');
        res.redirect('/message');
      }
    });
  });
});

router.get('/forgotPass',function(req,res){
  res.render('pages/forgotPass',{
    user: req.user,
    title: 'Forget Password?',
    subTitle: 'Enter This Accounts Email',
    fullName: req.user.firstname + ' ' + req.user.lastname,
    userName: req.user.username,
    image: req.user.userPhoto.contentType
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
          user: 'Enter Own Credentials Here!',
          pass: 'Enter Own Credentials Here!'
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
  Account.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgotPass');
    }
    res.render('pages/reset', {
      user: req.user,
      title: 'Reset Password',
      error: req.flash('error')
    });
  });
});

router.post('/reset/:token', function(req, res, next) {
  async.waterfall([
    function(done) {
      Account.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('/');
        }

        //user.username = req.user.username;
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err){
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
          user: 'Enter Own Credentials Here!',
          pass: 'Enter Own Credentials Here!'
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

//This gets my restaurants for the favorites page.
router.get('/foodTypes', function(req,res,next){
  Food.find(function(err,favs){
    if(err)return next(err);
    res.json(favs);
  });
});

router.get('/favorites',function(req,res){
  res.render('pages/favorites',{
    user: req.user,
    username: req.user.username,
    title:'Favorites',
    fullName: req.user.firstname + ' ' + req.user.lastname,
    userName: req.user.username,
    image: req.user.userPhoto.contentType,
    yourFavs: req.user.Foods.Type,
    favsError: req.flash('favsError'),
    chosen: req.cookies.favorites
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
});

router.get('/deleteProfile',function(req,res){
  res.render('pages/deleteProfile',{
    user: req.user.username,
    title: 'Delete Account',
    fullName: req.user.firstname + ' ' + req.user.lastname,
    userName: req.user.username,
    image: req.user.userPhoto.contentType
  });
});

router.post('/deleteProfile',function(req,res){
  Account.findByIdAndRemove({ _id: req.user.id }, function(err, account){
    if(err) throw err;
    req.flash('deleted', 'Your Account has been Deleted... Goodbye.');
    res.redirect('/message');
  });
});

//Thank you GENTLEMEN!!!
module.exports = router;