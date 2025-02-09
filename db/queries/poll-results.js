const db = require('../connection');

const getPollResults = (poll_id) => {
  return db.query(`
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
      p.title AS poll_title,
      o.id AS option_id,
      o.title AS option_title,
      COALESCE(SUM((SELECT COUNT(*) FROM options WHERE poll_id = $1) - rv.vote_rank), 0) AS borda_score
    FROM polls p
    JOIN ordered_options o ON p.id = $1
    LEFT JOIN ranked_votes rv ON o.fixed_order = rv.fixed_order
    WHERE p.id = $1
    GROUP BY p.title, o.id, o.title
    ORDER BY borda_score DESC;
  `, [poll_id])// query database to get this pole_id, admin_id to result, Submit-link to vote/route
    .then(data => {
      return data.rows;
    });
};

module.exports = { 
  getPollResults
};