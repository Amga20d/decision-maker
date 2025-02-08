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
