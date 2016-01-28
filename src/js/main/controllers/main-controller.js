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
            $scope.notifyStops = [];
            $scope.$on('notifier:nearBusStops', function (event, args) {
                var nearBusStops = args.nearStops;
                var busStopsToBeNotified = NotifierHttpService.getBusStopsToBeNotified();
                nearBusStops.forEach(function (nearStop) {
                    var storedStop = busStopsToBeNotified[nearStop._id];
                    if (angular.isDefined(storedStop)) storedStop['notify'] = false;
                    busStopsToBeNotified[nearStop._id] = undefined;
                    var index = NotifierHttpService.getSelectedBusStops().indexOf(nearStop._id);
                    if (index > -1) {
                        NotifierHttpService.getSelectedBusStops().splice(index, 1);
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
                    triggerNotification();
                }
                if (NotifierHttpService.getSelectedBusStops().length == 0) {
                    NotifierHttpService.stopNotifier();
                }
            });

            $scope.closeModal = function () {
                $scope.notifyStops = [];
                SharedState.turnOff('modal1');
            };

            function triggerNotification() {
                var message = $scope.notificationMessage + '\n';
                $scope.notifyStops.forEach(function (stop) {
                    message = message + stop._id + ' - ' + stop.name + '\n';
                });
                cordova.plugins.notification.local.cancelAll();
                cordova.plugins.notification.local.schedule({
                    id: 1,
                    text: message,
                    badge: 1,
                    led: "007DFF"
                });
                navigator.vibrate(1000);
            };

        }]);