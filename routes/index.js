var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Purchase Price Allocations Visualized Through Benchmarking' });
});

router.get('/results_table', function(req, res) {
  res.render('index/results_table', {title: 'Result'});
});

router.get('/about', function(req, res) {
  res.render('index/about', {title: 'About'});
});

router.get('/terms_of_service', function(req, res) {
  res.render('index/terms_of_service', {title: 'Terms of service'});
});

router.get('/privacy_policy', function(req, res) {
  res.render('index/privacy_policy', {title: 'Privacy Policy'});
});

module.exports = router;
