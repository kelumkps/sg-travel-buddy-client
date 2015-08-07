'use strict';

angular.module('SGTravelBuddy')

    .controller('MainCtrl', ['$scope', '$location', '$translate', 'Authorizer', 'NotifierHttpService', 'SharedState',
        function ($scope, $location, $translate, Authorizer, NotifierHttpService, SharedState) {

            $scope.isLoggedIn = Authorizer.isLoggedIn();
            $scope.logout = function () {
                Authorizer.logout(function () {
                    $location.path('/login');
                });
            };

            $scope.busStopsToBeNotified = [];
            $scope.$on('notifier:selectedBusStops', function (event, args) {
                angular.copy(args.selectedStops, $scope.busStopsToBeNotified);
            });

            $scope.notifyStops = [];
            $scope.$on('notifier:nearBusStops', function (event, args) {
                var nearBusStops = args.nearStops;
                nearBusStops.forEach(function (nearStop) {
                    var index = $scope.busStopsToBeNotified.indexOf(nearStop._id);
                    if (index > -1) {
                        $scope.busStopsToBeNotified.splice(index, 1);
                        $scope.notifyStops.push(nearStop);
                    }
                });
                if ($scope.notifyStops.length > 1) {
                    $scope.notificationMessage = $translate.instant('views.bus.near.notification.multiple');
                } else if (nearBusStops.length == 1) {
                    $scope.notificationMessage = $translate.instant('views.bus.near.notification.single');
                }
                if ($scope.notifyStops.length != 0) {
                    SharedState.turnOn('modal1');
                } else {
                    SharedState.turnOff('modal1');
                }
                if ($scope.busStopsToBeNotified.length == 0) {
                    NotifierHttpService.stopNotifier();
                }
            });

            $scope.closeModal = function () {
                $scope.notifyStops = [];
                SharedState.turnOff('modal1');
            }

        }]);