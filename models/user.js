var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var config = require('../config/database');

mongoose.connect(config.database);

var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  company: {
    type: String,
    required: false
  },
  jobfunction: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true,
    default: false
  },
  temporaryToken: {
    type: String,
    required: true
  },
  resettoken: {
    type: String,
    required: false
  }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
		if(err) return callback(err);
		callback(null, isMatch);
	});
}

module.exports.getUserByEmail = function(email, callback) {
	var query = { email: email };
	User.findOne(query).select('email password').exec(callback);
}

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
}

module.exports.createUser = function(newUser, callback){
	bcrypt.hash(newUser.password, 10, function(err, hash) {
		if(err) throw err;
		// Set hashed pw
		newUser.password = hash;
		// Create User
		newUser.save(callback);
	});

}
