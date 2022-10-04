var express = require('express');
var router = express.Router();
var apiModel = require('../models/apiModel');

// Create API object
let apodURL = {}

const apiTest = new apiModel

// // Perform API Promise call, assign object to apodUrl
apiTest.call().then((api) =>{
  apodURL = api.url
 }).catch(console.error)


/* GET home page. */
router.get('/', function(req, res, next) {
  
  // pass apodUrl and perform check on view if media_type is equal to image
  res.render('index', { apod: apodURL });
});

module.exports = router;
