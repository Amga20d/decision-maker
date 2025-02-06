// Client facing scripts here

const API_KEY = require('../scripts/api-key');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY ||  API_KEY });

const sendEmail = function(email) {
  return mg.messages.create("sandbox443685a65aa2458bad6e58580cbe033b.mailgun.org", {
    from: "MOGARZ <alicea.9a@gmail.com>",
    to: [`John Doe <${email}>`],
    subject: "Poll Links",
    text: "Admin link: heres/a/linkt/hat/is/totally/real1234 !\n Submission link: heres/a/linkt/hat/is/totally/real22222 ",
  });
};

module.exports = {sendEmail};
