// load .env data into process.env
require('dotenv').config();

// Web server config
const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 8001;
const app = express();
const path = require('path');

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users');
const profileRoutes = require('./routes/profile');
const create_pollRoutes = require('./routes/create_poll');
const linkRoutes = require('./routes/links');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/api/widgets', widgetApiRoutes);
app.use('/users', usersRoutes);
app.use('/profile', profileRoutes);
app.use('/create_poll', create_pollRoutes);
app.use('/links',linkRoutes);

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
