<<<<<<< HEAD
INSERT INTO votes (rank, total_points, user_id, poll_id, options_id) VALUES
(1, NULL, 1, 1, 1),
(2, NULL, 2, 1, 1),
(3, NULL, 3, 1, 1),
(1, NULL, 1, 2, 2),
(2, NULL, 2, 2, 2),
(3, NULL, 3, 2, 2),
(1, NULL, 1, 3, 3),
(2, NULL, 2, 3, 3),
(3, NULL, 3, 3, 3);
=======
INSERT INTO votes (rank, user_id, poll_id) VALUES
(ARRAY[1, 2, 3], 1, 1),
(ARRAY[2, 1, 3], 2, 1),
(ARRAY[3, 1, 2], 3, 1),
(ARRAY[1, 3, 2], 1, 2),
(ARRAY[2, 1, 3], 2, 2),
(ARRAY[3, 2, 1], 3, 2),
(ARRAY[1, 2, 3], 1, 3),
(ARRAY[2, 3, 1], 2, 3),
(ARRAY[3, 1, 2], 3, 3);

>>>>>>> e576306c161298a8bb25e02457a011ba681bfc15
