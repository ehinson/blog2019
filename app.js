var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const uri = require('./config/keys').mongoURI;
mongoose
    .connect(uri, { useNewUrlParser: true })
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

var db = mongoose.connection;
db.once('open', function () {
    console.log("MongoDB successfully connected")
    // we're connected!
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
