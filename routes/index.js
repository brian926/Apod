var express = require('express');
var router = express.Router();
var apiModel = require('../models/apiModel');

// Create API object
let apodURL = {}

// Perform API Promise call, assign values to variable apodUrl
apiModel().then((api) =>{
  apodURL.url = api['url']['url']
  apodURL.exp = api['url']['explanation']
  apodURL.title = api['url']['title']
  apodURL.media_type = api['url']['media_type']
}).catch(console.error)

/* GET home page. */
router.get('/', function(req, res, next) {
  var mascots = [
    { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
    { name: 'Tux', organization: "Linux", birth_year: 1996},
    { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
  ];

  var tagline = "No programming concept is complete without a cute animal mascot.";

  // pass apodUrl and perform check on view if media_type is equal to image
  res.render('index', { mascots: mascots, tagline: tagline, apod: apodURL });
});

module.exports = router;
