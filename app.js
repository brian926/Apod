var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cron = require('node-cron')

var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
var pastRouter = require('./routes/pastApods');
var liveRouter = require('./routes/live');
var signUpRouter = require('./routes/signup');
var confirmRouter = require('./routes/confirm')
var deleteRouter = require('./routes/delete')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/live', liveRouter);
app.use('/pastApods', pastRouter);
app.use('/signup', signUpRouter)
app.use('/confirm', confirmRouter)
app.use('/delete', deleteRouter)

import { upload } from './routes/upload'

// cronjob
cron.schedule('30 14 * * *', function() {
  console.log('running the cronjob')
  upload();
})

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

module.exports = app;
