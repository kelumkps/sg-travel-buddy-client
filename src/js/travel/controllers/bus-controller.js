'use strict';

angular.module('SGTravelBuddy.travel')
    .controller('BusCtrl', ['$rootScope','$scope', '$translate', '$routeParams', 'BusService', 'Authorizer', 'NotifierHttpService',
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
                $rootScope.$broadcast('notifier:selectedBusStops', { selectedStops: $scope.selectedBusStops });
            };

            $scope.disableNotifyButton = false;

            $scope.startNotifier = function () {
                if ($scope.selectedBusStops.length > 0) {
                    $scope.disableNotifyButton = true;
                    NotifierHttpService.createNotifier(function(route) {
                        console.log('created route response', route);                        
                        NotifierHttpService.startNotifier(route._id, function(err) {
                            console.log('notifire start error', err);                           
                        });
                    }, function(err) {
                        console.log('notifire create error', err);
                        $scope.messages.error = $translate.instant('views.app.error.service.unavailable');
                        $scope.disableNotifyButton = false;
                    });
                }
            };

            $scope.$on('notifier:busStops', function(event, args) {
                console.log('inside bus controller on notifier:busStops');
                var nearBusStops = args.nearStops;
                nearBusStops.forEach(function (nearStop) {
                    var storedStop = $scope.busStopsToBeNotified[nearStop];
                    storedStop['notify'] = false;
                    var index = $scope.selectedBusStops.indexOf(nearStop);
                    if (index > -1) {
                        $scope.selectedBusStops.splice(index, 1);
                        console.log('splice from selectedBusStops');
                    }
                });


                //todo remove below
                if(nearBusStops.length > 1) {
                    $scope.messages.info = "Following bus stops are colse to your current location \n" + JSON.stringify(nearBusStops);
                } else {
                    $scope.messages.info = "Following bus stop is colse to your current location \n" + nearBusStops;
                }

                
            });

            $scope.$on('notifier:stopNotifier', function(event) {
                $scope.disableNotifyButton = false;
            });
        }]);
