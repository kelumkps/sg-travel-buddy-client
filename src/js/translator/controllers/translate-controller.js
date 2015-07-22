'use strict';

angular.module('SGTravelBuddy.translator')
    .controller('TranslateController', ['$translate', '$scope', function ($translate, $scope) {
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
        };
    }]);
