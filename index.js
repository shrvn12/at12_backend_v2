
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
var cors = require('cors');
require('dotenv').config();

// var indexRouter = require('../routes/index.js');


// Use path.join to resolve the file paths
const indexRouter = require(path.join(__dirname, 'routes', 'index.js'));
const musicRouter = require(path.join(__dirname, 'routes', 'music.js'));
const authRouter = require(path.join(__dirname, 'routes', 'auth.js'));
const userRouter = require(path.join(__dirname, 'routes', 'user.js'));

// var musicRouter = require('../routes/music.js');
var app = express();
// app.use(cors());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const mongoUrl = process.env.MONGO_URI;
mongoose.connect(mongoUrl)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/', indexRouter);
app.use('/music', musicRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

module.exports = app;
