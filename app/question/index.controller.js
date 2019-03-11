(function () {
    'use strict';

    angular
        .module('app')
        .controller('Question.IndexController', Controller);

    function Controller(QuestionService) {
        var vm = this;

        vm.questions = [];

        initController();

        function initController() {
            QuestionService.GetAll().then(function (questions) {
                vm.questions = questions;
            });
        }
    }

})();