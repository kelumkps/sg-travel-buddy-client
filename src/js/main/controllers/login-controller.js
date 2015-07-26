'use strict';

angular.module('SGTravelBuddy')

    .controller('LoginCtrl', ['$scope', '$location', '$translate', 'Authorizer', function ($scope, $location, $translate, Authorizer) {
        $scope.messages = {};
        $scope.rememberMe = false;
        $scope.login = function () {
            Authorizer.login({
                    email: $scope.email,
                    password: $scope.password,
                    rememberme: $scope.rememberMe
                },
                function () {
                    $location.path('/');
                },
                function (err) {
                    $scope.messages.error = $translate.instant('views.login.invalid.message');
                });
        };
    }]);