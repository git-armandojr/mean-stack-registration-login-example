var config = require('config.json');
var express = require('express');
var router = express.Router();
var questionService = require('services/question.service');

// routes
router.post('/question', createQuestion);
router.get('/all', getAll);

module.exports = router;

function createQuestion(req, res) {
    questionService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req,res) {
  questionService.getAll()
    .then(function (questions) {
      console.log('The questions are ' + questions[0]);
      res.send(questions)
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}