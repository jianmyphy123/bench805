import express from 'express';
const router = express.Router();
import { ensureAuthenticated } from '../common/authGuard';


router.get('/', ensureAuthenticated ,(req, res) => {
  res.render('dashboard/index', { title: 'Dashboard' });
});

module.exports = router;
