const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { sendEmail } = require('../public/scripts/email');

// GET route to display the poll
router.get('/', (req, res) => {
  console.log('vote: fire!');

  const pollId = req.query.pollId || 1;  // change as needed

  const query = `
    SELECT polls.id AS poll_id, polls.title AS poll_title,
           options.id AS option_id, options.title AS option_title, options.description AS option_description
    FROM polls
    JOIN options ON polls.id = options.poll_id
    WHERE polls.id = $1
    ORDER BY options.id;  -- or any fixed ordering criteria
  `;

  db.query(query, [pollId])
    .then(result => {
      if (result.rows.length === 0) {
        return res.send("Poll not found");
      }

      // Construct the poll object. We add a fixed order property for each option.
      const poll = {
        id: result.rows[0].poll_id,
        title: result.rows[0].poll_title,
        options: result.rows.map((row, index) => ({
          id: row.option_id,          // actual option id (used in join later)
          fixed: index + 1,           // fixed order index (1-indexed)
          title: row.option_title,
          description: row.option_description
        }))
      };

      res.render('voting_poll', { poll });
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

// POST route to handle vote submission
router.post('/', (req, res) => {
  // req.body.order will be a comma-separated string, e.g. "3,2,1"
  const orderStr = req.body.order;
  if (!orderStr) {
    return res.status(400).send("No vote order submitted.");
  }
  // Convert the string to an array of integers
  const orderArray = orderStr.split(',').map(num => parseInt(num, 10));

  // Do we need this ?
  const userId = 1;
  // Capture the poll id from the submitted form data
  const pollId = parseInt(req.body.poll_id, 10);

  const queryStr = `
  SELECT users.email as email, polls.admin_link as link
  FROM polls
  JOIN users ON admin_id = users.id
  WHERE polls.id = $1;`;

  const queryValues = [4]; // when connected change to poll_id

  db.query(queryStr,queryValues).then((data) => {
    const email_values = { admin_email: data.rows[0].email, poll_link: null, admin_link: data.rows[0].link};
    sendEmail(email_values)
    .then((res) => {
      console.log(res);
    })
  })
  // Insert into votes table; votes.rank stores the ranking array.
  const insertQuery = `
    INSERT INTO votes (rank, user_id, poll_id)
    VALUES ($1, $2, $3)
    RETURNING id;
  `;
  db.query(insertQuery, [orderArray, userId, pollId])
    .then(result => {
      // Vote inserted; redirect to /results
      res.redirect('/results');
    })
    .catch(err => {
      console.error('Error inserting vote', err.stack);
      res.sendStatus(500);
    });
});

module.exports = router;
