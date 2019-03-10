var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('questions');

var service = {};

// service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

// function authenticate(username, password) {
//     var deferred = Q.defer();

//     db.users.findOne({ username: username }, function (err, user) {
//         if (err) deferred.reject(err.name + ': ' + err.message);

//         if (user && bcrypt.compareSync(password, user.hash)) {
//             // authentication successful
//             deferred.resolve({token :jwt.sign({ sub: user._id }, config.secret), userId: user._id});
//         } else {
//             // authentication failed
//             deferred.resolve();
//         }
//     });

//     return deferred.promise;
// }

function getById(_id) {
    var deferred = Q.defer();

    db.questions.findById(_id, function (err, question) {
        if (err) 
            deferred.reject(err.name + ': ' + err.message);
       
        deferred.resolve();
    });

    return deferred.promise;
}

function create(questionParam) {
    var deferred = Q.defer();

    // validation
    db.questions.findOne(
        { question: questionParam.question },
        function (err, question) {
            if (err) 
                deferred.reject(err.name + ': ' + err.message);
            if (question) {
                deferred.reject('Question "' + questionParam.question + '" is already taken');
            } else {
                createQuestion();
            }
        });

    function createQuestion() {
        var question = _.pick(questionParam, "question");

        db.questions.insert(
            question,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
        
    }

    return deferred.promise;
}

function update(_id, questionParam) {
    var deferred = Q.defer();

    // validation
    db.questions.findById(_id, function (err, question) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (question.question !== questionParam.question) {
            // username has changed so check if the new username is already taken
            db.questions.findOne(
                { question: questionParam.question },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Question "' + req.body.question + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            question: questionParam.question
        };

        db.questions.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.questions.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}