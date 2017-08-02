var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var expressValidator = require('express-validator');
var flash = require('connect-flash');

var index = require('./routes/index');
var users = require('./routes/users');
var dashboard = require('./routes/dashboard');
import { jwtSecret } from './config';

var app = express();

var PORT = process.env.PORT || 3000;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
	secret: jwtSecret,
	saveUninitialized: true,
	resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(cookieParser(jwtSecret));

app.use(flash());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/dashboard', dashboard);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(req, res) {
   // Expose "error" and "message" to all views that are rendered.
   res.locals.error = req.session.error || '';
   res.locals.message = req.session.message || '';

   // Remove them so they're not displayed on subsequent renders.
   delete req.session.error;
   delete req.session.message;
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

<<<<<<< HEAD:src/app.js
app.listen(PORT, process.env.IP, function(){
  console.log("Server has started " + PORT);
=======
// app.listen(3000, process.env.IP, function(){
//     console.log("Server has started");
// });

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
>>>>>>> eb079b43fc941b1cbc306c8747c52df96055fff6:app.js
});
