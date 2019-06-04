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


const isValidPassword = (user, password) => {
  return bcrypt.compare(password, user.password);
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ title: 'Express', message: req.flash('message') });
});

/* GET sign in page. */
router.post('/register', [
  check('username', 'The password must be 5+ chars long and contain a number').exists({ checkFalsy: true }),
  check('username', 'The password must be 5+ chars long and contain a number').isEmail(),
  check('username', 'The password must be 5+ chars long and contain a number').custom(existingUsername),
  check('email', 'The password must be 5+ chars long and contain a number').exists({ checkFalsy: true }),
  check('email', 'The password must be 5+ chars long and contain a number').isEmail(),
  check('email', 'The password must be 5+ chars long and contain a number').custom(existingEmail),
  check('password', 'The password must be 5+ chars long and contain a number').exists({ checkFalsy: true }),
  check('password').isLength({ min: 8 }).withMessage('must be at least 8 chars long'),
  check('password__confirmation').exists({ checkFalsy: true }),
  check('password__confirmation').custom(passwordEquality),
], (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    // Response will contain something like
    // { errors: [ "body[password]: must be at least 10 chars long" ] }
    return res.status(400).json({ errors: result.mapped() });
  }

  passport.authenticate('register', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.status(400).json(info); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next)
});

/* GET login page. */
router.get('/login', function (req, res, next) {
  res.json({ title: 'Express', message: req.flash('message') });
});

/* GET logout */
router.get('/logout', function (req, res, next) {
  res.json({ title: 'Express' });
});

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



passport.use('register', new LocalStrategy({
  passReqToCallback: true,
},
  function (req, username, password, done) {
    const findOrCreateUser = () => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { return done(err); }
        if (user) {
          console.log('User Already Exists with username: ', username);
          return done(null, false, {message: 'User already exists'});
        }
        bcrypt.genSalt(12, (err, salt) => {
          if (err) { return done(err); }
          return bcrypt.hash(password, salt, (err, hash) => {
            if (err) { return done(err); }
            const newUser = new User({
              username: username,
              email: req.body.email,
              password_digest: hash,
            });
            newUser
              .save()
              .then(user => done(null, user))
              .catch(err => done(err));
      
          })
        })
        return done(null, newUser)
      });
    }
    process.nextTick(findOrCreateUser);
  }
));

passport.use('login', new LocalStrategy(
  function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log('User Not Found with username: ', username);
        return done(null, false, flash('message', 'Incorrect username.'));
      }
      isValidPassword(user, password).then(res => {
        if (res){
          return done(null, user);
        }
        else {
          return done(null, false, { message: 'Invalid password' });
        }
      })
    });
  }
));

module.exports = router;
