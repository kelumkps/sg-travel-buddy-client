'use strict';

angular.module('SGTravelBuddy.translator')
    .controller('TranslateController', function ($translate, $scope) {
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
        };
    });
