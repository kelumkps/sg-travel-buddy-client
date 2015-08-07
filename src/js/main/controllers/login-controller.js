'use strict';

angular.module('SGTravelBuddy')

    .controller('LoginCtrl', ['$scope', '$location', '$translate', 'Authorizer', function ($scope, $location, $translate, Authorizer) {
        $scope.messages = {};
        $scope.rememberMe = false;
        $scope.loading = false;
        $scope.login = function () {
            $scope.loading = true;
            Authorizer.login({
                    username: $scope.email,
                    password: $scope.password,
                    rememberMe: $scope.rememberMe
                },
                function () {
                    $scope.loading = false;
                    $location.path('/');
                },
                function (err) {
                    $scope.loading = false;
                    $scope.messages.error = $translate.instant('views.login.invalid.message');
                });
        };
    }]);