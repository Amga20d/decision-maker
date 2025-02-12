const formData = require('form-data');
const { error } = require('jquery');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

const sendEmail = function(email_values, intialEmail) {
  const { admin_email, poll_link , admin_link } = email_values;

// intial email is true for creating the poll
  if (intialEmail){
    // Validate email_values for creating poll
    if (!admin_email || !poll_link || !admin_link) {
      return Promise.reject(new Error('Missing required email values.'));
    }
    return mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `Poll Creator <mailgun@${process.env.MAILGUN_DOMAIN}>`,
      to: [admin_email],
      subject: 'Poll Links',
      text: `Your poll has been created successfully!\n\nSubmission link (share your poll): ${poll_link}\nAdmin link (view results): ${admin_link}`,
      html: `
        <h1>Your Poll Has Been Created!</h1>
        <p>Submission link (share your poll): <a href="${poll_link}">${poll_link}</a></p>
        <p>Admin link (view results): <a href="${admin_link}">${admin_link}</a></p>
      `
    });
    //intial email is false for updating creator of poll results
  } else {
    // Validate email_values for updating polls
    if (!admin_email || !admin_link) {
      return Promise.reject(new Error('Missing required email values.'));
    }
    return mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `Poll Creator <mailgun@${process.env.MAILGUN_DOMAIN}>`,
      to: [admin_email],
      subject: 'Updated Poll Results',
      html: `Votes added to poll result! See the new rankings here: <a href="${admin_link}">${admin_link}</a>`,
    });
  }
};

module.exports = { sendEmail };
