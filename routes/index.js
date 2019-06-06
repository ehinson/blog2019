/* eslint-disable consistent-return */
/* eslint-disable func-names */
const express = require('express');
const path = require('path');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

const {
  passwordEquality,
  existingEmail,
  existingUsername,
  registerValidationChain
} = require('../validation/register');

const isValidPassword = (user, password) => {
  return bcrypt.compare(password, user.password);
};

/* GET home page. */
router.get('/', function(req, res, _next) {
  res.json({ title: 'Express', message: 'message' });
});

/* GET sign in page. */
router.post('/validate', registerValidationChain, (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.mapped() });
  }

  return res.status(200).json({});
});

router.post('/register', registerValidationChain, (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.mapped() });
  }

  passport.authenticate('register', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json(info);
    }
    req.logIn(user, function(error) {
      if (error) {
        return next(error);
      }
      return res.status(201).json(user);
    });
  })(req, res, next);
});

/* GET login page. */
router.get('/login', function(req, res, _next) {
  res.sendFile(path.join(__dirname, 'login.html'));
});

/* GET logout */
router.get('/logout', function(_req, res, _next) {
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

passport.use(
  'register',
  new LocalStrategy(
    {
      passReqToCallback: true
    },
    function(req, username, password, done) {
      const findOrCreateUser = () => {
        User.findOne({ username }, (err, user) => {
          if (err) {
            return done(err);
          }
          if (user) {
            return done(null, false, { message: 'User already exists' });
          }
          bcrypt.genSalt(12, (err2, salt) => {
            if (err2) {
              return done(err2);
            }
            return bcrypt.hash(password, salt, (err3, hash) => {
              if (err3) {
                return done(err3);
              }
              const newUser = new User({
                username,
                email: req.body.email,
                password_digest: hash
              });
              newUser
                .save()
                .then(userObj => done(null, userObj))
                .catch(error => done(error));
            });
          });
        });
      };
      process.nextTick(findOrCreateUser);
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(function(username, password, done) {
    User.findOne({ username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        console.log('User Not Found with username: ', username);
        return done(null, false, flash('message', 'Incorrect username.'));
      }
      isValidPassword(user, password).then(res => {
        if (res) {
          return done(null, user);
        }

        return done(null, false, { message: 'Invalid password' });
      });
    });
  })
);

module.exports = router;
