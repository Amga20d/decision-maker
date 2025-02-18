DROP TABLE IF EXISTS votes CASCADE;
CREATE TABLE votes (
  id SERIAL PRIMARY KEY NOT NULL,
  rank INT[] NOT NULL,
  user_id INT NOT NULL,
  poll_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (poll_id) REFERENCES polls(id)
  )
