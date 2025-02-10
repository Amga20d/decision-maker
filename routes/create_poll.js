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
  const { title, admin_email, option1, option1_desc, option2, option2_desc, option3, option3_desc } = req.body;

  // Validate required fields
  if (!title || !admin_email) {
    return res.status(400).send('Title and admin email are required.');
  }

  // Set default descriptions if not provided
  const option1Description = option1_desc || 'No description given';
  const option2Description = option2_desc || 'No description given';
  const option3Description = option3_desc || 'No description given';

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
      // Insert options
      const insertOptionsQuery = `
        INSERT INTO options (title, description, poll_id)
        VALUES
        ($1, $2, $3),
        ($4, $5, $6),
        ($7, $8, $9);
      `;
      const optionsValues = [
        option1, option1Description, poll_id,
        option2, option2Description, poll_id,
        option3, option3Description, poll_id
      ];

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
            \nPoll link: ${email_values.poll_link} \nAdmin link: ${email_values.admin_link} \nAdmin email: ${email_values.admin_email}`
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
