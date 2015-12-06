'use strict';

angular.module('SGTravelBuddy.cordova', [])

    .factory('deviceReady', function () {
        return function (done) {
            if (typeof window.cordova === 'object') {
                document.addEventListener('deviceready', function () {
                    done();
                }, false);
            } else {
                done();
            }
        };
    });
