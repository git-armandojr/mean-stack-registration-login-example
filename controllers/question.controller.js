var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/', function (req, res) {
    res.render('question');
});

router.post('/', function (req, res) {
    //register using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/questions/question',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('question', { error: 'An error occurred' });
        }

        if (response.statusCode !== 200) {
            return res.render('question', {
                error: response.body,
                question: req.body.question
            });
        }

        // return to login page with success message
        req.session.success = 'Question saved successful';
        return res.redirect('/question');
    });
});

module.exports = router;