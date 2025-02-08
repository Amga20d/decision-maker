const API_KEY = require('../scripts/api-key');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY || API_KEY});

const sendEmail = function(email, poll_link, admin_link) {
  return mg.messages.create("sandbox443685a65aa2458bad6e58580cbe033b.mailgun.org", {
    from: "MOGARZ <alicea.9a@gmail.com>",
    to: [`John Doe <${email}>`],
    subject: "Poll Links",
    text: `Your poll has been created successfully! \nSubmission link (share your poll): ${poll_link}\nAdmin link (view results): ${admin_link}`
  });
};

module.exports = {sendEmail};
