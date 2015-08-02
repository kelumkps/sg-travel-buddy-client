'use strict';

angular.module('SGTravelBuddy.travel')
    .controller('BusCtrl', ['$scope', '$translate', '$routeParams', 'BusService', function ($scope, $translate, $routeParams, BusService) {
        $scope.messages = {};
        $scope.showTabs = false;
        $scope.showSecondTab = false;
        BusService.getBusServiceById($routeParams.busId, function (bus) {
            if (bus) {
                $scope.showTabs = true;
                $scope.showSecondTab = (bus.routes == 2);
                $scope.busNumber = bus._id;
                $scope.busName = bus.name;
                $scope.routeOneStops = bus.routeOneStops;
                $scope.routeTwoStops = bus.routeTwoStops;
            }
        }, function (err) {
            $scope.messages.error = $translate.instant('views.app.error.service.unavailable');
        });
    }]);
