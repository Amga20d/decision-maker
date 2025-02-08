SELECT
    users.email AS user_email,
    polls.title AS poll_title,
    options.title AS option_title,
    SUM(votes.total_points) AS total_points,
    votes.rank AS option_rank
FROM
    users
JOIN
    polls ON users.id = polls.admin_id
JOIN
    options ON polls.id = options.poll_id
JOIN
    votes ON options.id = votes.options_id
GROUP BY
    users.email, polls.title, options.title, votes.rank
ORDER BY
    users.email, polls.title, option_rank, options.title;
q
