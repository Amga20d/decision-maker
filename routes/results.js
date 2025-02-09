const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', (req, res) => {
  const pollId = 2; // change as needed

  const query = `
    WITH ordered_options AS (
      SELECT id, title,
             row_number() OVER (ORDER BY id) AS fixed_order
      FROM options
      WHERE poll_id = $1
    ),
    ranked_votes AS (
      SELECT
        v.id AS vote_id,
        v.poll_id,
        v.rank[i] AS vote_rank,
        i AS fixed_order
      FROM votes v,
           generate_subscripts(v.rank, 1) AS i
      WHERE v.poll_id = $1
    )
    SELECT
      o.id AS option_id,
      o.title AS option_title,
      COALESCE(SUM((SELECT COUNT(*) FROM options WHERE poll_id = $1) - rv.vote_rank), 0) AS borda_score
    FROM ordered_options o
    LEFT JOIN ranked_votes rv ON o.fixed_order = rv.fixed_order
    GROUP BY o.id, o.title
    ORDER BY borda_score DESC;
  `;

  db.query(query, [pollId])
    .then(result => {
      const rankings = result.rows;
      res.render('poll_results', { rankings });
    })
    .catch(err => {
      console.error('Error executing query', err.stack);
      res.status(500).send('Internal Server Error');
    });
});

module.exports = router;
