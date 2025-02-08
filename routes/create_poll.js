const express = require('express');
const router = express.Router();
const db = require('../db/connection');
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
    });
});

router.post('/', (req, res) => {
  const { title, admin_email, option1, option1_desc, option2, option2_desc, option3, option3_desc } = req.body;

  // Set default descriptions if not provided
  const option1Description = option1_desc || 'No description given';
  const option2Description = option2_desc || 'No description given';
  const option3Description = option3_desc || 'No description given';

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
        INSERT INTO polls (title, admin_id, sub_id)
        VALUES ($1, $2, $3)
        RETURNING id;
      `;
      const pollValues = [title, admin_id, '']; // Placeholder for sub_id

      return db.query(insertPollQuery, pollValues)
        .then((pollData) => {
          const poll_id = pollData.rows[0].id;
          const sub_id = `http://localhost:8080/polls/${poll_id}`; // Generate unique URL

          // Update poll with the generated sub_id
          const updatePollQuery = `
            UPDATE polls
            SET sub_id = $1
            WHERE id = $2;
          `;
          const updateValues = [sub_id, poll_id];

          return db.query(updatePollQuery, updateValues)
            .then(() => ({ sub_id, poll_id })); // Return the sub_id and poll_id
        });
    })
    .then(({ sub_id, poll_id }) => {
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

      return db.query(insertOptionsQuery, optionsValues)
        .then(() => sub_id); // Return the sub_id
    })
    .then((sub_id) => {
      // Generate results URL
      const results_url = `${sub_id}/results`;

      // Send email using Mailgun
      return sendEmail(admin_email, sub_id, results_url);
    })
    .then(() => {
      db.query('SELECT * FROM users;')
        .then((data) => {
          const templateVars = {
            users: data.rows,
            successMessage: `Poll created successfully! An email with the poll link and admin link has been sent to ${req.body.admin_email}.`
          };
          res.render('create_poll', templateVars);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error creating poll');
    });
});

module.exports = router;
