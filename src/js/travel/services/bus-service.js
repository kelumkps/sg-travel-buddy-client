'use strict';

angular.module('SGTravelBuddy.travel')
    .service('BusService', ['$http', function ($http) {
        this.getBusServiceNumbers = function (success, error) {
            $http.get('/api/buses', {params: {fields: '_id'}, cache: true}).success(success).error(error);
        };

        this.getBusServiceById = function (id, success, error) {
            $http.get('/api/buses/' + id, {cache: true}).success(success).error(error);
        };

        this.searchBusStops = function (searchKey, success, error) {
            return $http.get('/api/stops', {
                params: {
                    q: searchKey,
                    fields: '_id,name'
                }
            }).then(success, error);
        };
    }]);
