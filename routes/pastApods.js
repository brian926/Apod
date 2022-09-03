var express = require('express');
var router = express.Router();
var apiModel = require('../models/apiModel');

// Create API object
let apodURL = {}

const apiTest = new apiModel

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('pastApods', { apod: "" });
});

router.post('/', function(req, res, next) {

    apiTest.addDate = req.body.datepicker
    // // Perform API Promise call, assign object to apodUrl
    apiTest.call().then((api) =>{
      apodURL = api.url;
      res.render('pastApods', { apod: apodURL });
    }).catch(console.error)  
  });

module.exports = router;
