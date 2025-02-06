SELECT
  users.id AS user_id,
  users.email AS user_email,
  polls.id AS poll_id,
  polls.title AS poll_title,
  polls.sub_id AS poll_link
FROM
  users
JOIN
  polls ON users.id = polls.admin_id;
