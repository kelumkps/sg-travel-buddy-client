'use strict';

angular.module('SGTravelBuddy.travel')
    .controller('BusCtrl', ['$rootScope', '$scope', '$translate', '$routeParams', 'BusService', 'Authorizer', 'NotifierHttpService',
        function ($rootScope, $scope, $translate, $routeParams, BusService, Authorizer, NotifierHttpService) {
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
            $scope.selectedBusStops = [];
            $scope.busStopsToBeNotified = {};
            $scope.changeSelectedBusStops = function (stop) {
                var showIcon = true;
                if ($scope.selectedBusStops.length > 0) {
                    var index = $scope.selectedBusStops.indexOf(stop.number);
                    if (index > -1) {
                        $scope.selectedBusStops.splice(index, 1);
                        showIcon = false;
                        var storedStop = $scope.busStopsToBeNotified[stop.number];
                        storedStop['notify'] = showIcon;
                        $scope.busStopsToBeNotified[stop.number] = undefined;
                    } else if (Authorizer.isLoggedIn()) {
                        $scope.selectedBusStops.push(stop.number);
                        $scope.busStopsToBeNotified[stop.number] = stop;
                    } else {
                        $scope.messages.warning = $translate.instant('views.bus.multiple.stops.warning');
                        showIcon = false;
                    }
                } else {
                    $scope.selectedBusStops.push(stop.number);
                    $scope.busStopsToBeNotified[stop.number] = stop;
                }
                stop['notify'] = showIcon;

                NotifierHttpService.updateSelectedBusStops($scope.selectedBusStops);
                $rootScope.$broadcast('notifier:selectedBusStops', {selectedStops: $scope.selectedBusStops});
            };

            $scope.disableNotifyButton = false;

            $scope.startNotifier = function () {
                if ($scope.selectedBusStops.length > 0) {
                    $scope.disableNotifyButton = true;
                    NotifierHttpService.createNotifier(function (route) {
                        console.log('created route response', route);
                        NotifierHttpService.startNotifier(route._id, function (err) {
                            console.log('notifire start error', err);
                        });
                    }, function (err) {
                        console.log('notifire create error', err);
                        $scope.messages.error = $translate.instant('views.app.error.service.unavailable');
                        $scope.disableNotifyButton = false;
                    });
                }
            };

            $scope.$on('notifier:nearBusStops', function (event, args) {
                var nearBusStops = args.nearStops;
                var notifyMessageString = "";
                nearBusStops.forEach(function (nearStop) {
                    var storedStop = $scope.busStopsToBeNotified[nearStop._id];
                    storedStop['notify'] = false;
                    var index = $scope.selectedBusStops.indexOf(nearStop._id);
                    if (index > -1) {
                        $scope.selectedBusStops.splice(index, 1);
                    }
                    notifyMessageString = notifyMessageString + ' [' + nearStop._id + ' - ' + nearStop.name + ']';
                });

                //todo remove below
                if (nearBusStops.length > 1) {
                    $scope.messages.info = $translate.instant('views.bus.near.notification.multiple') + notifyMessageString;
                } else if (nearBusStops.length == 1) {
                    $scope.messages.info = $translate.instant('views.bus.near.notification.single') + notifyMessageString;
                }
            });

            $scope.$on('notifier:stopNotifier', function (event) {
                $scope.disableNotifyButton = false;
            });
        }]);
