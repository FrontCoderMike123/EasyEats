var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('pages/login', {
    title: 'Please Login',
    formTitle: 'Welcome Back',
    username: 'Username',
    password: 'Password',
    craving: 'Hungry for Something Else?',
    Login: 'Login'
  });
});

router.get('/signUp', function(req, res) {
  res.render('pages/signUp', {
    title: 'Register Today',
    comment: 'Start Eating Now!'
  });
});

router.get('/budget', function(req, res) {
  res.render('pages/budget', {
    title: 'Welcome Back!'
  });
});

module.exports = router;