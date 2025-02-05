// Client facing scripts here

const API_KEY = require('../scripts/api-key');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY ||  API_KEY });

const sendEmail = function() {
  return mg.messages.create("sandbox443685a65aa2458bad6e58580cbe033b.mailgun.org", {
    from: "MOGARZ <alicea.9a@gmail.com>",
    to: ["MOGAR <alicea.9a@gmail.com>"],
    subject: "Hello MOGAR",
    text: "Congratulations MOGAR, you just sent an email with Mailgun! You are truly awesome!\n This is from the function!",
  });
};
module.exports = {sendEmail};
