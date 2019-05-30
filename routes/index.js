const express = require('express');
const { check, body, validationResult } = require('express-validator/check');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const keys = require("../config/keys");
const User = require("../models/User");

const passwordEquality = require("../validation/register").passwordEquality;
const existingEmail = require("../validation/register").existingEmail;
const existingUsername = require("../validation/register").existingUsername;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET sign in page. */
router.post('/register', [
  check('username').exists({ checkFalsy: true }),
  check('username').isEmail(),
  check('username').custom(existingUsername),
  check('email').exists({ checkFalsy: true }),
  check('email').isEmail(),
  check('email').custom(existingEmail),
  check('password').exists({ checkFalsy: true }),
  check('password').isLength({ min: 8 }),
  check('password__confirmation').exists({ checkFalsy: true }),
  check('password__confirmation').custom(passwordEquality),
], function (req, res, next) {
  console.log(req.body)
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] }, (err, user) => {
    if (user && user.email === req.body.email) {
      return res.status(422).json({ errors: "email already exists" });
    }

    if (user && user.username === req.body.username) {
      return res.status(422).json({ errors: "username already exists" });
    }

    bcrypt.genSalt(12, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) throw err;
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password_digest: hash,
        });
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));

      })
    })

  })
});

/* GET login page. */
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Express' });
});

/* GET logout */
router.get('/logout', function (req, res, next) {
  res.render('login', { title: 'Express' });
});


passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

module.exports = router;
