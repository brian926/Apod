var express = require('express');
var router = express.Router();
const sgMail = require('@sendgrid/mail');
const sgClient = require('@sendgrid/client');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgClient.setApiKey(process.env.SENDGRID_API_KEY);

async function getContactByEmail(email) {
  const data = {
    "emails": [email]
  };
  const request = {
    url: `/v3/marketing/contacts/search/emails`,
    method: 'POST',
    body: data
  }
  const response = await sgClient.request(request);
  if(response[1].result[email]) return response[1].result[email].contact;
  else return null;
}
 
async function getListID(listName) {
  const request = {
    url: `/v3/marketing/lists`,
    method: 'GET',
  }
  const response = await sgClient.request(request);
  const allLists = response[1].result;
  return allLists.find(x => x.name === listName).id;
}
 
async function addContactToList(email, listID) {
  const data = {
    "list_ids": [listID],
    "contacts": [{
      "email": email
    }]
  };
  const request = {
    url: `/v3/marketing/contacts`,
    method: 'PUT',
    body: data
  }
  return sgClient.request(request);
}

router.get('/', async (req, res) => {
  try {
    const contact = await getContactByEmail(req.query.email);
    if(contact == null) throw `Contact not found.`;
    if (contact.custom_fields.conf_num ==  req.query.conf_num) {
      const listID = await getListID('Newsletter');
      await addContactToList(req.query.email, listID);
    } else {
      throw 'Confirmation number does not match';
    }
    res.render('message', { message: 'You are now subscribed to our newsletter. We can\'t wait for you to hear from us!' });
  } catch (error) {
    console.error(error);
    res.render('message', { message: 'Subscription was unsuccessful. Please <a href="/signup">try again.</a>' });
  }
});

module.exports = router;
