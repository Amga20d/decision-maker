const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

// Use environment variables for Mailgun API key and domain
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

const sendEmail = function(email_values) {
  const { admin_email, poll_link, admin_link } = email_values;

  // Validate email_values
  if (!admin_email || !poll_link || !admin_link) {
    return Promise.reject(new Error('Missing required email values.'));
  }

  return mg.messages.create(process.env.MAILGUN_DOMAIN, {
    from: `Poll Creator <mailgun@${process.env.MAILGUN_DOMAIN}>`,
    to: [admin_email], // Ensure this is an array
    subject: 'Poll Links',
    text: `Your poll has been created successfully!\n\nSubmission link (share your poll): ${poll_link}\nAdmin link (view results): ${admin_link}`,
    html: `
      <h1>Your Poll Has Been Created!</h1>
      <p>Submission link (share your poll): <a href="${poll_link}">${poll_link}</a></p>
      <p>Admin link (view results): <a href="${admin_link}">${admin_link}</a></p>
    `
  });
};

module.exports = { sendEmail };
