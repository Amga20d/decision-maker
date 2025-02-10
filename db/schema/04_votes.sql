DROP TABLE IF EXISTS votes CASCADE;
CREATE TABLE votes (
  id SERIAL PRIMARY KEY NOT NULL,
<<<<<<< HEAD
  rank INT NOT NULL,
  total_points INT,
=======
  rank INT[] NOT NULL,
>>>>>>> e576306c161298a8bb25e02457a011ba681bfc15
  user_id INT NOT NULL,
  poll_id INT NOT NULL,
  options_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (poll_id) REFERENCES polls(id),
  FOREIGN KEY (options_id) REFERENCES options(id)
);
