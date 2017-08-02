import express from 'express';
const router = express.Router();



const ensureAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/users/login');
}




router.get('/', ensureAuthenticated ,(req, res) => {
  res.render('dashboard/index', { title: 'Dashboard' });
});

module.exports = router;
