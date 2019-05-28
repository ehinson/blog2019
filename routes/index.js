var express = require('express');
const validator = require('express-validator');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET sign in page. */
router.get('/register', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* GET logout */
router.get('/logout', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

module.exports = router;
