const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password_digest: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now()
  },
  modified: {
    type: Date,
    default: Date.now()
  }
});

module.exports = User = mongoose.model('User', userSchema);
