const express = require('express');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

const { passwordEquality, existingEmail, existingUsername } = require('../validation/register');

const isValidPassword = (user, password) => {
  return bcrypt.compare(password, user.password);
};

/* GET home page. */
router.get('/', function(req, res, _next) {
  res.json({ title: 'Express', message: req.flash('message') });
});

/* GET sign in page. */
router.post(
  '/register',
  [
    check('username', 'Username cannot be blank').exists({ checkFalsy: true }),
    check('username', 'Username is not a valid email').isAlphanumeric(),
    check('username').custom(existingUsername),
    check('email', 'Email cannot be blank').exists({ checkFalsy: true }),
    check('email', 'Not a valid email').isEmail(),
    check('email').custom(existingEmail),
    check('password', 'Password must be 8+ chars long').exists({ checkFalsy: true }),
    check('password')
      .isLength({ min: 8 })
      .withMessage('must be at least 8 chars long'),
    check('password__confirmation', 'Password confirmation cannot be blank').exists({
      checkFalsy: true
    }),
    check('password__confirmation').custom(passwordEquality)
  ],
  (req, res, next) => {
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
        return res.status(200).json(user);
      });
    })(req, res, next);
  }
);

/* GET login page. */
router.get('/login', function(req, res, _next) {
  res.json({ title: 'Express', message: req.flash('message') });
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
            console.log('User Already Exists with username: ', username);
            return done(null, false, { message: 'User already exists' });
          }
          bcrypt.genSalt(12, (err, salt) => {
            if (err) {
              return done(err);
            }
            return bcrypt.hash(password, salt, (err, hash) => {
              if (err) {
                return done(err);
              }
              const newUser = new User({
                username,
                email: req.body.email,
                password_digest: hash
              });
              newUser
                .save()
                .then(user => done(null, user))
                .catch(err => done(err));
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
