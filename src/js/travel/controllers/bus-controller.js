'use strict';

angular.module('SGTravelBuddy.travel')
    .controller('BusCtrl', ['$rootScope', '$scope', '$translate', '$routeParams', 'BusService', 'NotifierHttpService',
        function ($rootScope, $scope, $translate, $routeParams, BusService, NotifierHttpService) {
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
                    setNotificationStatus($scope.routeOneStops);
                    setNotificationStatus($scope.routeTwoStops);
                }
            }, function (err) {
                $scope.messages.error = $translate.instant('views.app.error.service.unavailable');
            });

            $scope.changeSelectedBusStops = function (stop) {
                NotifierHttpService.changeSelectedBusStops($scope, stop);
            };

            $scope.disableNotifyButton = NotifierHttpService.isNotifierOn();

            $scope.showNotifyButton = function () {
                return NotifierHttpService.getSelectedBusStops().length > 0;
            };

            $scope.startNotifier = function () {
                if (NotifierHttpService.getSelectedBusStops().length > 0) {
                    $scope.disableNotifyButton = true;
                    NotifierHttpService.createNotifier(function (route) {
                        NotifierHttpService.startNotifier(route._id, function (err) {
                        });
                    }, function (err) {
                        $scope.messages.error = $translate.instant('views.app.error.service.unavailable');
                        $scope.disableNotifyButton = false;
                    });
                }
            };

            var destroyListener = $scope.$on('notifier:nearBusStops', function (event, args) {
                var nearBusStops = args.nearStops;
                nearBusStops.forEach(function (nearStop) {
                    findAndModifyNotificationStatus($scope.routeOneStops, nearStop._id, false);
                    findAndModifyNotificationStatus($scope.routeTwoStops, nearStop._id, false);
                });
            });

            $scope.$on('$destroy', function () {
                destroyListener(); // remove listener.
            });

            $scope.$on('notifier:stopNotifier', function (event) {
                $scope.disableNotifyButton = false;
            });

            function setNotificationStatus(busStops) {
                if (angular.isArray(busStops)) {
                    var busStopsToBeNotified = NotifierHttpService.getBusStopsToBeNotified();
                    busStops.forEach(function (stop) {
                        if (angular.isDefined(busStopsToBeNotified[stop.number])) {
                            stop['notify'] = true;
                        }
                    });
                }
            };

            function findAndModifyNotificationStatus(busStops, number, status) {
                if (angular.isArray(busStops)) {
                    busStops.forEach(function (stop) {
                        if (stop.number == number) {
                            stop['notify'] = status;
                        }
                    });
                }
            };

        }]);
