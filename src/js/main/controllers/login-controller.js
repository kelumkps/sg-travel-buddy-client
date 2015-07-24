'use strict';

angular.module('SGTravelBuddy')

    .controller('LoginCtrl', ['$rootScope', '$scope', '$location', 'Authorizer', function ($rootScope, $scope, $location, Authorizer) {
        $scope.rememberMe = false;
		$scope.login = function () {
            $rootScope.error = "Failed to login";
            Authorizer.login({
                    email: $scope.email,
                    password: $scope.password,
                    rememberme: $scope.rememberMe
                },
                function (res) {
                    $location.path('/');
                },
                function (err) {
                    $rootScope.error = "Failed to login";
                });
        };
    }]);