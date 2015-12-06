'use strict';

angular.module('SGTravelBuddy.travel')
    .service('NotifierHttpService', ['$rootScope', '$http', '$interval', 'getCurrentPosition', 'Authorizer', '$translate', 'RemoteService',
        function ($rootScope, $http, $interval, getCurrentPosition, Authorizer, $translate, RemoteService) {
            var selectedBusStops = [],
                busStopsToBeNotified = {},
                hasUpdates = false,
                prevLat = 0,
                prevLng = 0,
                interval;

            this.createNotifier = function (success, error) {
                if (selectedBusStops.length > 0) {
                    getCurrentPosition(function (position) {
                        var lat = position.coords.latitude;
                        var lng = position.coords.longitude;
                        var coordinates = [lng, lat];
                        var routeData = {
                            coordinates: coordinates
                        };
                        if (hasUpdates) routeData['busStops'] = selectedBusStops;
                        $http.post(RemoteService.getBaseURL() + '/api/routes', routeData).success(success).error(error);
                    });
                }
            };

            this.startNotifier = function (routeId, error) {
                if (selectedBusStops.length > 0) {
                    interval = $interval(function () {
                        getCurrentPosition(function (position) {
                            var lat = position.coords.latitude;
                            var lng = position.coords.longitude;
                            if (lat != prevLat || lng != prevLng) {
                                prevLat = lat;
                                prevLng = lng;
                                var coordinates = [lng, lat];
                                var routeData = {
                                    coordinates: coordinates
                                };
                                if (hasUpdates) {
                                    routeData['busStops'] = selectedBusStops;
                                    hasUpdates = false;
                                }
                                updateRouteData(routeId, routeData, error);
                            }
                        });
                    }, 5000, 1400);
                }
            };

            this.stopNotifier = function () {
                if (interval) {
                    prevLat = 0;
                    prevLng = 0;
                    $interval.cancel(interval);
                    $rootScope.$broadcast('notifier:stopNotifier');
                    interval = undefined;
                }
            };

            this.isNotifierOn = function () {
                return angular.isDefined(interval);
            };

            this.getSelectedBusStops = function () {
                return selectedBusStops;
            };

            this.getBusStopsToBeNotified = function () {
                return busStopsToBeNotified;
            };

            this.changeSelectedBusStops = function ($scope, stop) {
                var showIcon = true;
                if (selectedBusStops.length > 0) {
                    var index = selectedBusStops.indexOf(stop.number);
                    if (index > -1) {
                        selectedBusStops.splice(index, 1);
                        showIcon = false;
                        var storedStop = busStopsToBeNotified[stop.number];
                        storedStop['notify'] = showIcon;
                        busStopsToBeNotified[stop.number] = undefined;
                    } else if (Authorizer.isLoggedIn()) {
                        selectedBusStops.push(stop.number);
                        busStopsToBeNotified[stop.number] = stop;
                    } else {
                        $scope.messages.warning = $translate.instant('views.bus.multiple.stops.warning');
                        showIcon = false;
                    }
                } else {
                    selectedBusStops.push(stop.number);
                    busStopsToBeNotified[stop.number] = stop;
                }
                stop['notify'] = showIcon;

                if (selectedBusStops.length > 0) {
                    hasUpdates = true;
                } else {
                    hasUpdates = false;
                    this.stopNotifier();
                }
            };

            function updateRouteData(routeId, routeData, error) {
                $http.put(RemoteService.getBaseURL() + '/api/routes/' + routeId, routeData).success(function (nearBusStops) {
                    var matchedNearBusStops = [];
                    var isArray = angular.isArray(nearBusStops);
                    selectedBusStops.forEach(function (stop) {
                        if (isArray) {
                            nearBusStops.forEach(function (nearStop) {
                                if (nearStop._id === stop) matchedNearBusStops.push({
                                    _id: stop,
                                    name: nearStop.name
                                });
                            });
                        } else if (nearBusStops._id === stop) {
                            matchedNearBusStops.push({
                                _id: stop,
                                name: nearStop.name
                            });
                        }
                    });

                    if (matchedNearBusStops.length > 0) {
                        $rootScope.$broadcast('notifier:nearBusStops', {nearStops: matchedNearBusStops});
                    }
                }).error(error);
            };

        }]);