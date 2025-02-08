const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET route to display the poll
router.get('/', (req, res) => {
  console.log('vote: fire!');

  // Capture poll id from the query string (or default to 1 for now)
  const pollId = req.query.pollId || 1;

  const query = `
    SELECT polls.id AS poll_id, polls.title AS poll_title,
           options.id AS option_id, options.title AS option_title, options.description AS option_description
    FROM polls
    JOIN options ON polls.id = options.poll_id
    WHERE polls.id = $1;
  `;

  db.query(query, [pollId])
    .then(result => {
      if (result.rows.length === 0) {
        return res.send("Poll not found");
      }

      // Construct the poll object with its options.
      const poll = {
        id: result.rows[0].poll_id,
        title: result.rows[0].poll_title,
        options: result.rows.map((row, index) => ({
          id: index + 1,  // renumbered sequentially for this poll
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

  const orderStr = req.body.order;
  if (!orderStr) {
    return res.status(400).send("No vote order submitted.");
  }
  // Convert the string to an array of integers
  const orderArray = orderStr.split(',').map(num => parseInt(num, 10));

  // Hard Coded UserId
  const userId = 1;
  // Capture the poll id from the submitted form data
  const pollId = parseInt(req.body.poll_id, 10);

  // Insert the vote into the votes table (which stores rank as an INT[]).
  const insertQuery = `
    INSERT INTO votes (rank, user_id, poll_id)
    VALUES ($1, $2, $3)
    RETURNING id;
  `;
  db.query(insertQuery, [orderArray, userId, pollId])
    .then(result => {
      // Vote inserted; redirect to the results page.
      res.redirect('/results');
    })
    .catch(err => {
      console.error('Error inserting vote', err.stack);
      res.sendStatus(500);
    });
});

module.exports = router;
