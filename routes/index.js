var express = require('express');
var router = express.Router();
var apiModel = require('../models/apiModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  var mascots = [
    { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
    { name: 'Tux', organization: "Linux", birth_year: 1996},
    { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
  ];

  var tagline = "No programming concept is complete without a cute animal mascot.";
  res.render('index', { mascots: mascots, tagline: tagline });
});

module.exports = router;
