/*
 * All routes for Widget Data are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /api/widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
const express = require('express');
const router  = express.Router();
const db = require('../db/connection');
const {sendEmail} = require('../public/scripts/app');

router.get('/', (req, res) => {
 db.query('SELECT * FROM users').then((data) => {
  const templateVars = {users: data.rows, sendEmail};
  res.render('profile', templateVars);
 }).catch((err) => {
  console.log(err);
 })
});

router.post('/', (req,res) => {
  console.log('Fired!');
  sendEmail()
  .then((data) => {
    console.log(data);
    res.redirect('/');
  }).catch((err) => {
    console.error(err);
  });


})

module.exports = router;
b
