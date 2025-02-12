const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// // GET route to display the poll
// router.get('/:poll_link', (req, res) => {
//   const poll_link = req.query.poll_link;

//   const query = `
//     SELECT polls.id AS poll_id, polls.title AS poll_title,
//            options.id AS option_id, options.title AS option_title, options.description AS option_description
//     FROM polls
//     JOIN options ON polls.id = options.poll_id
//     WHERE polls.link = $1
//     ORDER BY options.id;  -- or any fixed ordering criteria
//   `;

//   db.query(query, [poll_link])
//     .then(result => {
//       if (result.rows.length === 0) {
//         return res.send("Poll not found");
//       }

//       // Construct the poll object. We add a fixed order property for each option.
//       const poll = {
//         id: result.rows[0].poll_id,
//         title: result.rows[0].poll_title,
//         options: result.rows.map((row, index) => ({
//           id: row.option_id,          // actual option id (used in join later)
//           fixed: index + 1,           // fixed order index (1-indexed)
//           title: row.option_title,
//           description: row.option_description
//         }))
//       };

//       res.render('voting_poll', { poll });
//     })
//     .catch(err => {
//       console.error(err);
//       res.sendStatus(500);
//     });
// });


// Define your routes here
router.get('/:poll_link', (req, res) => {
  const poll_link = req.params.poll_link;

  const query = `
    SELECT polls.id AS poll_id, polls.title AS poll_title,
           options.id AS option_id, options.title AS option_title, options.description AS option_description
    FROM polls
    JOIN options ON polls.id = options.poll_id
    WHERE polls.poll_link = $1
    ORDER BY options.id;  -- or any fixed ordering criteria
  `;
  
  // Your route handler code here

  db.query(query, [poll_link])
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

module.exports = router;