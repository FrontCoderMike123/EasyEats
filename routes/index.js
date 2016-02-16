var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('pages/login', {
    title: 'Please Login',
    formTitle: 'Welcome Back',
    username: 'Username',
    password: 'Password',
    Login: 'Login'
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
    signUp: 'Sign Up'
  });
});

router.get('/budget', function(req, res) {
  res.render('pages/budget', {
    title: 'Hungry?',
    budgetTitle: 'Food Finder!',
    craving: 'Hungry for Something Else?',
    budget: 'Enter Budget',
    placeholder: '($)',
    find: 'Find Food'
  });
});

module.exports = router;