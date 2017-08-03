import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql';

import { jwtSecret, dbConfig } from '../config';



const connection = mysql.createConnection({
	host: dbConfig.host,
	user: dbConfig.user,
	password: dbConfig.password,
	database: dbConfig.database
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected to MySQL as id: ' + connection.threadId);
});


export const createUser = (newUser, callback) => {

  let { firstname, lastname, email, password, company, jobfunction } = newUser;

  let temporaryToken = jwt.sign({ firstname, lastname, email }, jwtSecret, { expiresIn: '24h'});

  let user = {
    firstname,
    lastname,
    email,
    password: bcrypt.hashSync(password, 10),
    company,
    jobfunction,
    temporaryToken
  }

  connection.query('insert into user set ? ', user, (err, results) => {
    return callback(err, results, temporaryToken);
  });
}

export const isExistUser = (email, callback) => {

  getUserByEmail(email, (err, user) => {
    if(user)
      return callback(err, true);
    else
      return callback(err, false);
  });

}

export const getUserByEmail = (email, callback) => {

  connection.query('select * from user where ?', { email }, (err, results) => {

    if(results.length == 0)
      return callback(err, false);

    return callback(err, results[0]);
  });

}

export const getUserById = (id, callback) => {
  connection.query('select * from user where ?', { id }, (err, results) => {

    if(results.length == 0)
      return callback(err, false);

    return callback(err, results[0]);
  });
}

export const getUserByTemporaryToken = (temporaryToken, callback) => {

  connection.query('select * from user where ?', { temporaryToken }, (err, results) => {

    if(results.length == 0)
      return callback(err, false);

    return callback(err, results[0]);
  });
}

export const comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
		if(err) return callback(err);
		callback(null, isMatch);
	});
}

export const activateAccount = (temporaryToken, callback) => {
  connection.query('update user set active = ?, temporaryToken = null where ?', [1, {temporaryToken}], err => {
    callback(err);
  });
}

export const resetPasswordToken = (id, resetToken, callback) => {
	connection.query('update user set ? where ? ', [{resetToken}, {id}], err => {
		callback(err);
	});
}

export const getUserByResetToken = (resetToken, callback) => {

  connection.query('select * from user where ?', { resetToken }, (err, results) => {

    if(results.length == 0)
      return callback(err, false);

    return callback(err, results[0]);
  });
}

export const resetPasswordByToken = (password, resetToken, callback) => {

	let hash = bcrypt.hashSync(password, 10);

	connection.query('update user set password = ?, resetToken = null where ?', [hash, {resetToken}], (err, results) => {
		callback(err);
	});

}
