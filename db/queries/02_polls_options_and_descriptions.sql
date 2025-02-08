SELECT
  polls.title AS poll_title,
  options.title AS option_title,
  options.description AS option_description
FROM
  polls
JOIN
  options ON polls.id = options.poll_id;
