const express = require('express');
const router  = express.Router();
const db = require('../db/connection');

router.get('/', (req, res) => {
  console.log('vote: fire!');
  db.query('SELECT * FROM polls WHERE id = 1;')
  .then((data) => {
    console.log(data.rows);
    const templateVars = {polls: data.rows};
  res.render('voting_poll',templateVars);
  }).catch((err) => {
    console.error(err);
  });
});

module.exports = router;
