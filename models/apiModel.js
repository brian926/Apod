require('dotenv').config();
const https = require('https')

const apiKey = process.env.API_KEY;
const apodUrl = 'https://api.nasa.gov/planetary/apod?api_key=' + apiKey

module.exports = () => new Promise((resolve, reject) => {
    https.get(apodUrl, response => {
      try {
        let body = " ";
  
        response.on('data', data => {
          body += data.toString();
        });
        response.on('end', () => {
          const url = JSON.parse(body);
          resolve({url: url});
        });
      } catch (error) {
        reject(error);
      }
    });
  });
