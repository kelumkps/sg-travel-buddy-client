'use strict';

angular.module('SGTravelBuddy.geoLocation', [])
    .factory('getCurrentPosition', ['$document', '$window', '$rootScope', 'deviceReady', function ($document, $window, $rootScope, deviceReady) {
        return function (done) {
            deviceReady(function () {
                var options = {enableHighAccuracy: true};
                navigator.geolocation.getCurrentPosition(function (position) {
                    $rootScope.$apply(function () {
                        done(position);
                    });
                }, function (error) {
                    var errorMessage = "Unable to retrieve position";
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = "User denied the request for Geolocation.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = "Location information is unavailable.";
                            break;
                        case error.TIMEOUT:
                            errorMessage = "The request to get user location timed out.";
                            break;
                        case error.UNKNOWN_ERROR:
                            errorMessage = "An unknown error occurred.";
                            break;
                    }
                    $rootScope.$apply(function () {
                        throw new Error(errorMessage);
                    });
                }, options);
            });
        };
    }]);