var express = require('express');
var router = express.Router();
const sg = require('../models/sg');

async function deleteContactFromList(listID, contact) {
    const request = {
      url: `/v3/marketing/lists/${listID}/contacts`,
      method: 'DELETE',
      qs: {
        "contact_ids": contact.id
      }
    }
    await sg.sgClient.request(request);
}

async function getContactByEmail(email) {
    const data = {
      "emails": [email]
    };
    const request = {
      url: `/v3/marketing/contacts/search/emails`,
      method: 'POST',
      body: data
    }
    const response = await sg.sgClient.request(request);
    if(response[1].result[email]) return response[1].result[email].contact;
    else return null;
}

async function getListID(listName) {
    const request = {
      url: `/v3/marketing/lists`,
      method: 'GET',
    }
    const response = await sg.sgClient.request(request);
    const allLists = response[1].result;
    return allLists.find(x => x.name === listName).id;
}

router.get('/', async (req, res) => {
    try {
        const contact = await getContactByEmail(req.query.email);
        console.log(contact.email, req.query.email)
        if(contact == null) throw `Contact not found.`;
        if (contact.custom_fields.conf_num ==  req.query.conf_num) {
            const listID = await getListID('Newsletter');
            await deleteContactFromList(listID, contact);
            res.render('message', { message: 'You have been successfully unsubscribed. If this was a mistake re-subscribe <a href="/signup">here</a>.' });
        }
        else throw 'Confirmation number does not match or contact is not subscribed'
        }
        catch(error) {
        console.error(error)
        res.render('message', { message: 'Email could not be unsubscribed. please try again.' })
        }
});

module.exports = router;
