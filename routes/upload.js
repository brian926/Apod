var express = require('express');
var router = express.Router();
const sgMail = require('@sendgrid/mail');
const sgClient = require('@sendgrid/client');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgClient.setApiKey(process.env.SENDGRID_API_KEY);

const uploadPage = {
    title: 'Upload Newsletter',
    subtitle: 'Upload an HTML newsletter to send out to subscribers',
    form: `<form action="/upload" id="contact-form" enctype="multipart/form-data" method="post" style="margin: 10%; margin-left:5%; width: 350px;">
    <div class="form-group">
        <label for="subject">Email Subject:</label>
        <input type="text" class="form-control" id="subject" name="subject" placeholder="Subject" required>
    </div>
    <div class="form-group">
        <label for="newsletter">Newsletter: </label>
        <input type="file" id="newsletter" name="newsletter" accept=".html" required>
    </div>
    <button type="submit" style="background:#0263e0 !important;" class="btn btn-primary">Send</button>
   </form>`
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
