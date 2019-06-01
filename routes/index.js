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
], passport.authenticate('register', {
    successRedirect: '/login',
    failureRedirect: '/',
    failureFlash : true 
}));

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
  passReqToCallback: true
},
  function (req, username, password, done) {
    const findOrCreateUser = () => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { return done(err); }
        if (user) {
          console.log('User Already Exists with username: ', username);
          return done(null, false, req.flash('message', 'User already exists'));
        }
        bcrypt.genSalt(12, (err, salt) => {
          if (err) throw err;
          return bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            const newUser = new User({
              username: username,
              email: req.body.email,
              password_digest: hash,
            });
            newUser
              .save()
              .then(user => done(null, user))
              .catch(err => console.log(err));
      
          })
        })
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
