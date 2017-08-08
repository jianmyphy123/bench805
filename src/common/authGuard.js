import { admin } from '../config';

export const ensureAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/users/login');
}

export const ensureAdmin = (req, res, next) => {
  if(req.isAuthenticated() && req.user.email === admin.email) {
		return next();
	}
	res.redirect('/users/login');
}
