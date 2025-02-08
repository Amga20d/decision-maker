const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', (req, res) => {
  console.log('vote: fire!');

  // Query to fetch the poll and its associated options
  const query = `
    SELECT polls.id AS poll_id, polls.title AS poll_title, options.id AS option_id, options.title AS option_title, options.description AS option_description
    FROM polls
    JOIN options ON polls.id = options.poll_id
    WHERE polls.id = $1;
  `;

  db.query(query, [2])
    .then(result => {
      if (result.rows.length === 0) {
        return res.send("Poll not found");
      }

      // Construct the poll object with its options
      const poll = {
        id: result.rows[0].poll_id,
        title: result.rows[0].poll_title,
        options: result.rows.map(row => ({
          id: row.option_id,
          title: row.option_title,
          description: row.option_description
        }))
      };

      const templateVars = { poll };
      res.render('voting_poll', templateVars);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

module.exports = router;
