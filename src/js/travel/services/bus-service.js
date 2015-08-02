'use strict';

angular.module('SGTravelBuddy.travel')
    .service('BusService', ['$http', function ($http) {
        this.getBusServiceNumbers = function(success, error) {
            $http.get('/api/buses', {params: {fields: '_id'}, cache:true}).success(success).error(error);
        }
    }]);
