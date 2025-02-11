SELECT
  users.email AS user_email,
  polls.title AS poll_title,
  polls.sub_id AS poll_link
FROM
  users
JOIN
  polls ON users.id = polls.admin_id;
