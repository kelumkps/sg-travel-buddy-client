'use strict';

angular.module('SGTravelBuddy.translator')
    .controller('TranslateCtrl', ['$translate', '$scope', function ($translate, $scope) {
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
        };
    }]);
