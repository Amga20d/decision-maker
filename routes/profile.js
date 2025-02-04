/*
 * All routes for Widget Data are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /api/widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const db = require('../db/connection');

router.get('/', (req, res) => {
db.query('SELECT * FROM USERS;')
.then((data) => {
  console.log(data.rows);
  const templateVars = {
    users: data.rows
  }
  res.render('profile', templateVars);

}).catch((err) => {
  console.log(err)
})

});

module.exports = router;
