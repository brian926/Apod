var express = require('express');
var router = express.Router();
const { sgClient, sgMail } = require('../models/sg');

const signUpPage = {
    title: 'Join Our Newsletter',
    subtitle: 'Subscribe to our newsletter to receive the latest news and products.',
    form: `<form action="/signup" id="contact-form" method="post" style="margin: 10%; margin-left:5%; width: 350px;">
        <div class="form-group">
            <label for="firstname">First Name</label>
            <input type="text" class="form-control" id="firstname" name="firstname" placeholder="First Name" required>
        </div>
        <div class="form-group">
            <label for="lastname">Last Name</label>
            <input class="form-control" id="lastname" name="lastname" placeholder="Last Name" required>
        </div>
        <div class="form-group">
            <label for="email">Email address</label>
            <input type="email" class="form-control" id="email" name="email" placeholder="Enter email" required>
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <button type="submit" style="background:#0263e0 !important;" class="btn btn-primary">Subscribe</button>
    </form>`
};   

function randNum() {
    return Math.floor(Math.random() * 90000) + 10000;
   }
   
   async function addContact(firstName, lastName, email, confNum) {
    const customFieldID = await getCustomFieldID('conf_num');
    const data = {
      "contacts": [{
        "email": email,
        "first_name": firstName,
        "last_name": lastName,
        "custom_fields": {}
      }]
    };
    data.contacts[0].custom_fields[customFieldID] = confNum;
    const request = {
      url: `/v3/marketing/contacts`,
      method: 'PUT',
      body: data
    }
    return sgClient.request(request);
   }
   
   async function getCustomFieldID(customFieldName) {
    const request = {
      url: `/v3/marketing/field_definitions`,
      method: 'GET',
    }
    const response = await sgClient.request(request);
    const allCustomFields = response[1].custom_fields;
    return allCustomFields.find(x => x.name === customFieldName).id;
   }

router.get('/', (req, res) => {
  res.render('form', signUpPage);
});

router.post('/', async (req, res) => {
    const confNum = randNum();
    const params = new URLSearchParams({
      conf_num: confNum,
      email: req.body.email,
    });
    const confirmationURL = req.protocol + '://' + req.headers.host + '/confirm/?' + params;
    const msg = {
      to: req.body.email,
      from: process.env.SENDGRID_EMAIL, // Change to your verified sender
      subject: `Confirm your subscription to our newsletter`,
      html: `Hello ${req.body.firstname},<br>Thank you for subscribing to our newsletter. Please complete and confirm your subscription by <a href="${confirmationURL}"> clicking here</a>.`
    }
      await addContact(req.body.firstname, req.body.lastname, req.body.email, confNum);
      await sgMail.send(msg);
      res.render('message', { message: 'Thank you for signing up for our newsletter! Please complete the process by confirming the subscription in your email inbox.' });
})

module.exports = router;
