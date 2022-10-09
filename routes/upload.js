var express = require('express');
var router = express.Router();
const sgClient = require('../models/sg');

var apiModel = require('../models/apiModel');

// Create API object
let apodURL = {}

const apiTest = new apiModel

// // Perform API Promise call, assign object to apodUrl
apiTest.call().then((api) =>{
  apodURL = api.url
 }).catch(console.error)

const apodLetter = {
    text : `<div>
                <h2> apod.title </h2>
                <p> apod.date </p>
                <p> apod.explanation </p>
            </div>`
}
 
if(apod.media_type == 'image') {
    apodLetter.text += `<img src="<%= apod.url %>" alt="">`
} else {
    apodLetter.text +=`<iframe class="embed-responsive-item" title="<%= apod.title %>" src="<%= apod.url %>" allowfullscreen></iframe>`
}

async function sendNewsletterToList(req, htmlNewsletter, listID) {
    const data = {
    "query": `CONTAINS(list_ids, '${listID}')`
    };
    const request = {
    url: `/v3/marketing/contacts/search`,
    method: 'POST',
    body: data
    }
    const response = await sgClient.request(request);
    for (const subscriber of response[1].result) {
    const params = new URLSearchParams({
        conf_num: subscriber.custom_fields.conf_num,
        email: subscriber.email,
    });
    const unsubscribeURL = req.protocol + '://' + req.headers.host + '/delete/?' + params;
    const msg = {
        to: subscriber.email, // Change to your recipient
        from: process.env.SENDGRID_EMAIL, // Change to your verified sender
        subject: "Hello World",
        html: htmlNewsletter + `<a href="${unsubscribeURL}"> Unsubscribe here</a>`,
    }
    sgMail.send(msg);
    }
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

router.get('/', async(req, res) => {
    const listID = await getListID('Newsletter');
    const htmlNewsletter = "<span>hello world!</span>";
    await sendNewsletterToList(req, htmlNewsletter, listID)
    res.render('message', { message: 'Newsletter has been sent to all subscribers.' });
});

module.exports = router;