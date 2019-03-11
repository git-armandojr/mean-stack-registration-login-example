(function () {
    'use strict';

    angular
        .module('app')
        .controller('Question.IndexController', Controller);

    function Controller(QuestionService, FlashService) {
        var vm = this;

        vm.questions = [];
        vm.deleteQuestion = deleteQuestion;

        initController();

        function initController() {
            QuestionService.GetAll().then(function (questions) {
                vm.questions = questions;
            });
        }

        function deleteQuestion(_id) {
            QuestionService.Delete(_id)
                .then(function () {
                    FlashService.Success('Question deleted');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

})();