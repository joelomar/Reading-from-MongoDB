var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/users_db');

//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  console.log('User Connected to db');
  req.db = db;
  next();

});

//app.use('/', routes);
//app.use('/users', users);

app.get('/', function(req, res) {
    console.log('User request');
    req.db = db;
    var collection = db.get('user_records');
    collection.find({}, {}, function (err, records) {
         res.render('index', { "title" : records });
      
      });
    
});

app.post('/adduser', function (req, res, next) {
     req.db = db;

     var userName = req.body.name_input;
     var userEmail = req.body.email_input;
     var userPhone = req.body.phone_input;

     var collection = db.get('user_records');

     collection.insert({
         "name": userName,
          "email": userEmail,
           "phone": userPhone
            }, function (err, rec) {
             
             if (err) {
                console.log('error inserting');
             }
             else {
               console.log('succces inserting');
               res.redirect('/');


             }


     });

});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
