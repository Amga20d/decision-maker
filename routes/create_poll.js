const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const crypto = require('crypto');
const { sendEmail } = require('../public/scripts/email');

router.get('/', (req, res) => {
  db.query('SELECT * FROM users;')
    .then((data) => {
      const templateVars = {
        users: data.rows,
        successMessage: null
      };
      res.render('create_poll', templateVars);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error fetching users');
    });
});

router.post('/', (req, res) => {
  const { title, admin_email } = req.body;

  // Collect dynamic options (up to 10)
  const options = [];
  let i = 1;
  while (req.body[`option${i}`]) {
    const optionTitle = req.body[`option${i}`];
    const optionDescription = req.body[`option${i}_desc`] || 'No description given';
    options.push({ title: optionTitle, description: optionDescription });
    i++;
    if (i > 10) break; // Limit to 10 options
  }

  // Validate required fields
  if (!title || !admin_email || options.length === 0) {
    return res.status(400).send('Title, admin email, and at least one option are required.');
  }

  // Generate random strings for poll_link and admin_link
  const pollId = crypto.randomBytes(16).toString('hex');
  const adminId = crypto.randomBytes(16).toString('hex');

  // Store only the random string in the database
  const poll_link = pollId;
  const admin_link = adminId;

  // Generate full URLs for email
  const pollUrl = `http://localhost:8080/polls/${poll_link}`;
  const adminUrl = `http://localhost:8080/admin/${admin_link}`;

  // Create email_values object
  const email_values = { admin_email, poll_link: pollUrl, admin_link: adminUrl };

  // Check if admin email already exists
  const checkUserQuery = `
    SELECT id FROM users WHERE email = $1;
  `;
  const userValues = [admin_email];

  db.query(checkUserQuery, userValues)
    .then((userData) => {
      if (userData.rows.length > 0) {
        // Admin email exists, use existing user ID
        return userData.rows[0].id;
      } else {
        // Admin email does not exist, insert new user
        const insertUserQuery = `
          INSERT INTO users (email)
          VALUES ($1)
          RETURNING id;
        `;
        return db.query(insertUserQuery, userValues)
          .then((newUserData) => newUserData.rows[0].id);
      }
    })
    .then((admin_id) => {
      // Insert new poll
      const insertPollQuery = `
        INSERT INTO polls (title, admin_id, poll_link, admin_link)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
      `;
      const pollValues = [title, admin_id, poll_link, admin_link];

      return db.query(insertPollQuery, pollValues)
        .then((pollData) => pollData.rows[0].id);
    })
    .then((poll_id) => {
      // Dynamically construct the insert options query
      let insertOptionsQuery = 'INSERT INTO options (title, description, poll_id) VALUES ';
      const optionsPlaceholders = options.map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(', ');
      insertOptionsQuery += optionsPlaceholders;

      // Flatten options into a single array with poll_id
      const optionsValues = options.reduce((acc, option) => {
        acc.push(option.title, option.description, poll_id);
        return acc;
      }, []);

      return db.query(insertOptionsQuery, optionsValues);
    })
    .then(() => {
      // Send email using sendEmail function
      return sendEmail(email_values)
        .then(() => {
          console.log('Email sent successfully!');
          return db.query('SELECT * FROM users;');
        })
        .then((data) => {
          const templateVars = {
            users: data.rows,
            successMessage: `Poll created successfully!
            Links have been emailed to\nAdmin email: ${email_values.admin_email}`
          };
          res.render('create_poll', templateVars);
        });
    })
    .catch((err) => {
      console.error('Error creating poll:', err);
      res.status(500).send('Error creating poll');
    });
});

module.exports = router;
