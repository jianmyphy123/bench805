var express = require('express');
const bcrypt = require('bcrypt');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const nodemailer = require('nodemailer');
const mailconfig = require('../config/mail');
const secret = require('../config/secret').value;
const domain = require('../config/conf').domain;


var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: mailconfig.username,
    pass: mailconfig.password
  }
});

router.get('/signup', function(req, res, next) {
  res.render('users/signup', {
    title: 'Sign Up'
  });
});

router.post('/signup', function(req, res) {

  var firstname = req.body.user_first_name;
  var lastname = req.body.user_last_name;
	var email = req.body.user_email;
	var company = req.body.user_company;
	var jobfunction = req.body.job_function;
	var password = req.body.user_password;
	var password2 = req.body.user_confirm_password;

  req.checkBody('user_first_name', 'Firstname field is required').notEmpty();
  req.checkBody('user_last_name', 'Lastname field is required').notEmpty();
	req.checkBody('user_email', 'Email field is required').notEmpty();
	req.checkBody('user_email', 'Email not valid').isEmail();
	req.checkBody('user_password', 'Password field is required').notEmpty();
	req.checkBody('user_confirm_password', 'Password do not match').equals(req.body.user_password);

  let errors = null;

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {

      errors = result.array();

      res.render('users/signup', {
  			errors: errors,
        firstname: firstname,
        lastname: lastname,
        email: email,
        company: company,
        jobfunction: jobfunction
  		});
    } else {

      let temporaryToken = bcrypt.hashSync(email, 10);

  		var newUser = new User({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        company: company,
        jobfunction: jobfunction,
        temporaryToken: temporaryToken
  		});

  		// Create User
  		User.createUser(newUser, function(err, user) {
  			if(err) console.log(err);
  			console.log(user);
  		});

  		// Success Message
  		req.flash('success', 'Account registered! Please check your e-mail for activation link');

      var mainOptions = {
        from: 'John Doe <johndoe@outlook.com>',
        to: email,
        subject: domain + ' Activation Link',
        text: 'Hello '+firstname+',Thank you for your registering at '+ domain +'. Please click on the link to complete your activation: http://'+domain+'/activate/'+temporaryToken,
        html: 'Hello <strong>'+firstname+'</strong>,<br><br>Thank you for your registering at localhost.com. Please click on the link to complete your activation: <br><br><a href="http://'+domain+'/activate/'+temporaryToken+'">http://'+domain+'/activate</a>'
      }

      transporter.sendMail(mainOptions, function(error, info) {
        if(error) {
          console.log(error);
        }
        else {
          console.log('Message Sent: '+info.response);
          res.render('users/activation_sent');
        }
      });

  	}
  });

});

router.get('/signup_confirmation', function(req, res) {
  res.render('users/signup_confirmation', { title: 'Sign UP confirmation' });
});

router.get('/login', function(req, res, next) {
  res.render('users/login', {
    title: 'Log In'
  });
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'user_login',
    passwordField: 'user_password'
  },
	function(email, password, done) {
		User.getUserByEmail(email, function(err, user) {
			if(err) console.log(err);
			if(!user) {
				console.log('Unknown User');
				return done(null, false, { message: 'Unknown User' });
			}
			User.comparePassword(password, user.password, function(err, isMatch) {
				if(err) console.log(err);
				if(isMatch) {
          if(!user.active) {
            console.log('Not activated yet');
            return done(null, false, { message: 'Your account is not yet activated. Please check your e-mail for activation link.'});
          }
					else
            return done(null, user);
				} else {
					console.log('Invalid Password');
					return done(null, false, { message: 'Invalid Password'});
				}
			});
		});
	}
));

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
	failureRedirect: '/users/login',
  failureFlash: true})
);

router.get('/reset_password_congratulation', function(req, res, next) {
  res.render('users/reset_password_congratulation', {
    title: 'Reset password | Congratulations'
  });
});

router.get('/reset_password_fields', function(req, res, next) {
  res.render('users/reset_password_fields', {
    title: 'Reset password | Fields'
  });
});

router.get('/reset_password_sent', function(req, res, next) {
  res.render('users/reset_password_sent', {
    title: 'Reset password | Email sent'
  });
});

router.get('/reset_password', function(req, res, next) {
  res.render('users/reset_password', {
    title: 'Reset password. Step one'
  });
});



module.exports = router;
