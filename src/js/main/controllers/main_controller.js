'use strict';

angular.module('SGTravelBuddy')

    .controller('MainCtrl', ['$scope', 'Authorizer', '$location', function ($scope, Authorizer, $location) {
        $scope.isLoggedIn = Authorizer.isLoggedIn();
        $scope.logout = function () {
            Authorizer.logout(function () {
                $location.path('/login');
            });
        };
    }]);