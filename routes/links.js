const express = require('express');
const router  = express.Router();
const db = require('../db/connection');
const {sendEmail} = require('../public/scripts/email');

router.post('/', (req,res) => {
  console.log('Fired!');
  sendEmail(req.body.email)
  .then((data) => {
    console.log(data);
    res.redirect('/profile');
  }).catch((err) => {
    console.error(err);
  });


})

module.exports = router;
