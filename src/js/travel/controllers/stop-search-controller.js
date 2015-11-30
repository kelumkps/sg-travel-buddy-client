'use strict';

angular.module('SGTravelBuddy.travel')
    .controller('StopSearchCtrl', ['$rootScope', '$scope', '$translate', 'BusService', 'NotifierHttpService',
        function ($rootScope, $scope, $translate, BusService, NotifierHttpService) {
            $scope.messages = {};
            $scope.searchedBusStops = [];
            var selectedStops = NotifierHttpService.getSelectedBusStops();
            selectedStops.forEach(function (number) {
                var stop = NotifierHttpService.getBusStopsToBeNotified()[number];
                if (angular.isDefined(stop)) {
                    stop['notify'] = true;
                    $scope.searchedBusStops.push(stop);
                }
            });

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

            $scope.onSelect = function ($item) {
                $item['number'] = $item._id;
                $scope.searchedBusStops.push($item);
                if (angular.isDefined(NotifierHttpService.getBusStopsToBeNotified()[$item.number])) {
                    $item['notify'] = true;
                }
                $scope.selected = undefined;
            };

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

            $scope.$on('notifier:stopNotifier', function (event) {
                $scope.disableNotifyButton = false;
            });

            $scope.clearSelections = function () {
                $scope.searchedBusStops = [];
            }
        }]);
