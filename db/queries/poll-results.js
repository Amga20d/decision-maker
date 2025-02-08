const db = require('../connection');

const getPollResults = (poll_id) => {
  return db.query(`
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
      p.title AS poll_title,
      o.id AS option_id,
      o.title AS option_title,
      SUM((SELECT COUNT(*) FROM options WHERE poll_id = $1) - rv.rank_pos) AS borda_score
    FROM
      ranked_votes rv
    JOIN options o ON o.id = rv.option_id
    JOIN polls p ON p.id = rv.poll_id
    GROUP BY
      p.title, o.id, o.title
    ORDER BY
      borda_score DESC;
  `, [poll_id])
    .then(data => {
      return data.rows;
    });
};

module.exports = { 
  getPollResults
};