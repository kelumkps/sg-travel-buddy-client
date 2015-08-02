'use strict';

angular.module('SGTravelBuddy.travel')
    .controller('BusCtrl', ['$scope', '$translate', '$routeParams', 'BusService', 'Authorizer',
        function ($scope, $translate, $routeParams, BusService, Authorizer) {
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
            $scope.notifications = [];
            $scope.notifyStop = function (stop) {
                var showIcon = true;
                if ($scope.notifications.length > 0) {
                    var index = $scope.notifications.indexOf(stop.number);
                    if (index > -1) {
                        $scope.notifications.splice(index, 1);
                        showIcon = false;
                    } else if (Authorizer.isLoggedIn()) {
                        $scope.notifications.push(stop.number);
                    } else {
                        $scope.messages.warning = $translate.instant('views.bus.multiple.stops.warning');
                        showIcon = false;
                    }
                } else {
                    $scope.notifications.push(stop.number);
                }
                stop['notify'] = showIcon;
            }
        }]);
