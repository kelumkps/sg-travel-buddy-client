'use strict';

angular.module('SGTravelBuddy.travel')
    .controller('BusCtrl', ['$scope', '$translate', '$routeParams', function ($scope, $translate, $routeParams) {
        $scope.bus_number = $routeParams.busId;
    }]);
