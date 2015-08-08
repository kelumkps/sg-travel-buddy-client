'use strict';

angular.module('SGTravelBuddy.travel')
    .controller('StopSearchCtrl', ['$rootScope', '$scope', '$translate', 'BusService', 'NotifierHttpService', 'Authorizer',
        function ($rootScope, $scope, $translate, BusService, NotifierHttpService, Authorizer) {
            $scope.messages = {};

            $scope.searchBusStops = function (searchKey) {
                return BusService.searchBusStops(searchKey, function (response) {
                    return response.data.map(function (stop) {
                        stop['displayName'] = stop._id + ' - ' + stop.name;
                        return stop;
                    });
                }, function (err) {
                    $scope.scrollItems = [];
                    $scope.messages.error = $translate.instant('views.app.error.service.unavailable');
                });
            };

            $scope.searchedBusStops = [];
            $scope.onSelect = function ($item) {
                $scope.searchedBusStops.push($item);
                $scope.selected = undefined;
            };

            $scope.selectedBusStops = [];
            $scope.busStopsToBeNotified = {};
            $scope.changeSelectedBusStops = function (stop) {
                var showIcon = true;
                if ($scope.selectedBusStops.length > 0) {
                    var index = $scope.selectedBusStops.indexOf(stop._id);
                    if (index > -1) {
                        $scope.selectedBusStops.splice(index, 1);
                        showIcon = false;
                        var storedStop = $scope.busStopsToBeNotified[stop._id];
                        storedStop['notify'] = showIcon;
                        $scope.busStopsToBeNotified[stop._id] = undefined;
                    } else if (Authorizer.isLoggedIn()) {
                        $scope.selectedBusStops.push(stop._id);
                        $scope.busStopsToBeNotified[stop._id] = stop;
                    } else {
                        $scope.messages.warning = $translate.instant('views.bus.multiple.stops.warning');
                        showIcon = false;
                    }
                } else {
                    $scope.selectedBusStops.push(stop._id);
                    $scope.busStopsToBeNotified[stop._id] = stop;
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
                    var storedStop = $scope.busStopsToBeNotified[nearStop._id];
                    storedStop['notify'] = false;
                    var index = $scope.selectedBusStops.indexOf(nearStop._id);
                    if (index > -1) {
                        $scope.selectedBusStops.splice(index, 1);
                    }
                });
            });

            $scope.$on('$destroy', function() {
                destroyListener(); // remove listener.
            });

            $scope.$on('notifier:stopNotifier', function (event) {
                $scope.disableNotifyButton = false;
            });

            $scope.clearSelections = function () {
                $scope.searchedBusStops = [];
            }
        }]);
