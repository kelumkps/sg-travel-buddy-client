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

            $scope.changeSelectedBusStops = function (stop) {
                stop['number'] = stop._id;
                NotifierHttpService.changeSelectedBusStops($scope, stop);
            };

            $scope.disableNotifyButton = false;

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
                var busStopsToBeNotified = NotifierHttpService.getBusStopsToBeNotified();
                nearBusStops.forEach(function (nearStop) {
                    var storedStop = busStopsToBeNotified[nearStop._id];
                    storedStop['notify'] = false;
                    busStopsToBeNotified[nearStop._id] = undefined;
                    var index = NotifierHttpService.getSelectedBusStops().indexOf(nearStop._id);
                    if (index > -1) {
                        NotifierHttpService.getSelectedBusStops().splice(index, 1);
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
