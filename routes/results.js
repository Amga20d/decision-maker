const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', (req, res) => {
  const pollId = 2;

  const query = `
  WITH ranked_votes AS (
  SELECT
    v.id AS vote_id,
    v.poll_id,
    v.rank[i] AS option_id,
    i AS rank_pos
  FROM
    votes v,
    generate_subscripts(v.rank, 1) AS i
  WHERE
    v.poll_id = $1
)
SELECT
  o.id AS option_id,
  o.title AS option_title,
  SUM((SELECT COUNT(*) FROM options WHERE poll_id = $1) - rv.rank_pos) AS borda_score
FROM
  ranked_votes rv
JOIN options o ON o.id = rv.option_id
GROUP BY
  o.id, o.title
ORDER BY
  borda_score DESC;

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

