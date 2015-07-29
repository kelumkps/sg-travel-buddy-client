'use strict';

angular.module('SGTravelBuddy')

    .controller('MainCtrl', ['$scope', 'Authorizer' ,function ($scope, Authorizer) {
            $scope.isLoggedIn = Authorizer.isLoggedIn();
    }]);