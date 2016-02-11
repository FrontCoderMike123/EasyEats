var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('pages/login', {
    title: 'Please Login'
  });
});

router.get('/signUp', function(req, res) {
  res.render('pages/signUp', {
    title: 'Register Today',
    comment: 'Start Eating Now!'
  });
});

module.exports = router;