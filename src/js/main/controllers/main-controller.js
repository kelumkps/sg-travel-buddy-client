'use strict';

angular.module('SGTravelBuddy')

    .controller('MainCtrl', ['$scope', '$location', '$translate', 'Authorizer', 'NotifierHttpService',
        function ($scope, $location, $translate, Authorizer, NotifierHttpService) {

            $scope.isLoggedIn = Authorizer.isLoggedIn();
            $scope.logout = function () {
                Authorizer.logout(function () {
                    $location.path('/login');
                });
            };

            $scope.messages = {};
            $scope.busStopsToBeNotified = [];
            $scope.$on('notifier:selectedBusStops', function (event, args) {
                angular.copy(args.selectedStops, $scope.busStopsToBeNotified);
            });

            $scope.$on('notifier:nearBusStops', function (event, args) {
                var nearBusStops = args.nearStops;
                var notifyMessageString = "";
                nearBusStops.forEach(function (nearStop) {
                    notifyMessageString = notifyMessageString + ' [' + nearStop._id + ' - ' + nearStop.name + ']';
                });

                console.log("Following bus stops are colse to your current location ", nearBusStops);
                if (nearBusStops.length > 1) {
                    $scope.messages.info = $translate.instant('views.bus.near.notification.multiple') + notifyMessageString;
                } else if (nearBusStops.length == 1) {
                    $scope.messages.info = $translate.instant('views.bus.near.notification.single') + notifyMessageString;
                }

                nearBusStops.forEach(function (nearStop) {
                    var index = $scope.busStopsToBeNotified.indexOf(nearStop._id);
                    if (index > -1) {
                        $scope.busStopsToBeNotified.splice(index, 1);
                    }
                });

                if ($scope.busStopsToBeNotified.length == 0) {
                    NotifierHttpService.stopNotifier();
                }
            });


        }]);