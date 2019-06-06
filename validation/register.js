const { check } = require('express-validator/check');

const User = require('../models/User');

const passwordEquality = (value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Password confirmation does not match password');
  }

  // Indicates the success of this synchronous custom validator
  return true;
};

const existingEmail = value => {
  return User.findOne({ email: value }).then(user => {
    if (user) {
      return Promise.reject('E-mail already in use');
    }
  });
};

const existingUsername = value => {
  return User.findOne({ username: value }).then(user => {
    if (user) {
      return Promise.reject('Username already in use');
    }
  });
};

const registerValidationChain = [
  check('username', 'Username cannot be blank').exists({ checkFalsy: true }),
  check('username', 'Username should be alphanumeric').isAlphanumeric(),
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
];

module.exports = {
  passwordEquality,
  existingEmail,
  existingUsername,
  registerValidationChain
};
