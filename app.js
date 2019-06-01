const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport  = require('passport');
const session = require('express-session');
const flash = require('connect-flash');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const keys = require('./config/keys');

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: keys.secretOrKey,
    saveUninitialized: true,
    resave: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

const db = mongoose.connection;
db.once('open', function () {
  console.log("MongoDB successfully connected")
  // we're connected!
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
