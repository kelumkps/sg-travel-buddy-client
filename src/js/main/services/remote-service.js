'use strict';

angular.module('SGTravelBuddy.util', [])
    .service('RemoteService', ['$http', function ($http) {
        var baseURL = "https://sg-travelbuddy.rhcloud.com";

        this.getBaseURL = function() {
            return baseURL;
        };

    }]);