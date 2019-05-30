const { body } = require('express-validator/check');

const User = require("../models/User");


const passwordEquality = (value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Password confirmation does not match password');
  }

  // Indicates the success of this synchronous custom validator
  return true;
}

const existingEmail = value => {
  return User.findOne({ email: value }).then(user => {
    if (user) {
      return Promise.reject('E-mail already in use');
    }
  });
}

const existingUsername = value => {
  return User.findOne({ username: value }).then(user => {
    if (user) {
      return Promise.reject('Username already in use');
    }
  });
}

module.exports = {
  passwordEquality,
  existingEmail,
  existingUsername,
}