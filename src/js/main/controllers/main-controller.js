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

            $scope.notificationMessage = {};
            $scope.busStopsToBeNotified = [];
            $scope.$on('notifier:selectedBusStops', function (event, args) {
                angular.copy(args.selectedStops, $scope.busStopsToBeNotified);
            });
            $scope.notifyMessageString = "";
            $scope.$on('notifier:nearBusStops', function (event, args) {
                var nearBusStops = args.nearStops;
                nearBusStops.forEach(function (nearStop) {
                    var index = $scope.busStopsToBeNotified.indexOf(nearStop._id);
                    if (index > -1) {
                        $scope.notifyMessageString = $scope.notifyMessageString + ' [' + nearStop._id + ' - ' + nearStop.name + ']';
                        $scope.busStopsToBeNotified.splice(index, 1);
                    }
                });
                if (nearBusStops.length > 1) {
                    $scope.notificationMessage = $translate.instant('views.bus.near.notification.multiple') + $scope.notifyMessageString;
                } else if (nearBusStops.length == 1) {
                    $scope.notificationMessage = $translate.instant('views.bus.near.notification.single') + $scope.notifyMessageString;
                }
                if ($scope.notifyMessageString != "") {
                    SharedState.turnOn('modal1');
                } else {
                    SharedState.turnOff('modal1');

                }
                if ($scope.busStopsToBeNotified.length == 0) {
                    NotifierHttpService.stopNotifier();
                }
            });

            $scope.closeModal = function() {
                $scope.notifyMessageString = '';
                SharedState.turnOff('modal1');
            }

        }]);