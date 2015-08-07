'use strict';

angular.module('SGTravelBuddy.geolocation', [])
    .factory('getCurrentPosition', ['$document', '$window', '$rootScope', function ($document, $window, $rootScope) {
        return function (done) {
            navigator.geolocation.getCurrentPosition(function (position) {
                $rootScope.$apply(function () {
                    done(position);
                });
            }, function (error) {
                $rootScope.$apply(function () {
                    throw new Error('Unable to retreive position');
                });
            });
        };
    }]);