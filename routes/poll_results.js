const express = require('express');
const router  = express.Router();
const db = require('../db/connection');
const pollResultsQueries = require('../db/queries/poll-results');

router.get('/', (req, res) => {
  res.render("poll_results")
});

router.get('/:poll_id', (req, res) => {
  const poll_id = req.params.poll_id; // Extract the id from the URL

  pollResultsQueries.getPollResults(poll_id)
    .then(resultsDetails => {
      const templateVars = {
        resultsDetails: resultsDetails
        // resultsDetails: JSON.stringify(resultsDetails)
      };
      res.render("poll_results", templateVars); 
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });


     
});

module.exports = router;