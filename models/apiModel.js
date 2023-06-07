require('dotenv').config();
const https = require('https')

class APOD {
  constructor() {
    this.apiKey = process.env.API_KEY;
    this.url = 'https://api.nasa.gov/planetary/apod?api_key='
    this.apodUrl = this.url + this.apiKey
  }

  set addDate(date) {
    this.apodUrl = this.url + this.apiKey + '&date=' + date
  }

  call = () => new Promise((resolve, reject) => {
    https.get(this.apodUrl, response => {
      try {
        let body = " ";

        response.on('data', data => {
          body += data.toString();
        });
        response.on('end', () => {
          if (response.headers['content-type'] == "application/json") {
            const url = JSON.parse(body);
            resolve({ url: url });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  });
};

module.exports = APOD