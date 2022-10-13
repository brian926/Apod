var express = require('express');
var router = express.Router();
const sg = require('../models/sg');

var apiModel = require('../models/apiModel');

// Create API object
let apodURL = {}

const apiTest = new apiModel

async function getApod() {
    // // Perform API Promise call, assign object to apodUrl
    await apiTest.call().then((api) =>{
    apodURL = api.url
    }).catch(console.error)

    let apodLetter = `<div>
                    <h2> ${apodURL.title} </h2>
                    <p> ${apodURL.date} </p>
                    <p> ${apodURL.explanation} </p>
                </div>`

    
    if(apodURL.media_type == 'image') {
        apodLetter += `<div><img src="${apodURL.url}" alt=""></div>`
    } else {
        apodLetter += `<div><iframe class="embed-responsive-item" title="${apodURL.title}" src="${apodURL.url}" allowfullscreen></iframe></div>`
    }
    return apodLetter
}

async function sendNewsletterToList(htmlNewsletter, listID) {
    const data = {
    "query": `CONTAINS(list_ids, '${listID}')`
    };
    const request = {
    url: `/v3/marketing/contacts/search`,
    method: 'POST',
    body: data
    }
    const response = await sg.sgClient.request(request);
    for (const subscriber of response[1].result) {
    const params = new URLSearchParams({
        conf_num: subscriber.custom_fields.conf_num,
        email: subscriber.email,
    });
    console.log(params)
    const unsubscribeURL = 'http://localhost:3000/delete/?' + params;
    const msg = {
        to: subscriber.email, // Change to your recipient
        from: process.env.SENDGRID_EMAIL, // Change to your verified sender
        subject: "Hello World",
        html: htmlNewsletter + `<a href="${unsubscribeURL}"> Unsubscribe here</a>`,
    }
    sg.sgMail.send(msg);
    }
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

async function upload() {
    const listID = await getListID('Newsletter');
    const htmlNewsletter = await getApod();
    await sendNewsletterToList(htmlNewsletter, listID)
};

module.exports = upload();