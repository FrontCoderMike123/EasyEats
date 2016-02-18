var express = require('express');
var passport = require('passport');
var Account = require('../models/account.js');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('pages/index', {
      user : req.user,
      title: 'Welcome to EasyEatz!',
      subTitle: 'New or Not?'
    });
});

router.get('/login', function(req, res) {
  res.render('pages/login', {
    user: req.user,
    title: 'Please Login',
    formTitle: 'Welcome Back',
    username: 'Username',
    password: 'Password',
    Login: 'Login'
  });
});

router.post('/login', passport.authenticate('local'), function(req,res,err) {
  res.redirect('/budget');
});

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
    info: ''
  });
});

/*
router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});
*/

router.post('/signUp', function(req, res) {
    Account.register(new Account({ username : req.body.username, firstname: req.body.firstname, lastname: req.body.lastname }), req.body.password, function(err, account) {
        if (err) {
            return res.render("pages/signUp", {
              info: "Sorry. That username already exists. Try again.",
              title: 'Register Today',
              signUpTitle: 'Sign Up',
              username: 'Username',
              password: 'Password',
              fname: 'First Name',
              lname: 'Last Name',
              signUp: 'Sign Up'
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
    craving: 'Hungry for Something Else?',
    budget: 'Enter Budget',
    placeholder: '($)',
    find: 'Find Food',
    info: 'Hello '+req.user.username+', feeling hungry?'
  });
});

module.exports = router;