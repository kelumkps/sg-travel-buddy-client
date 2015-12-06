'use strict';

angular.module('SGTravelBuddy.travel')
    .service('BusService', ['$http', 'RemoteService', function ($http, RemoteService) {
        this.getBusServiceNumbers = function (success, error) {
            $http.get(RemoteService.getBaseURL() + '/api/buses', {params: {fields: '_id'}, cache: true}).success(success).error(error);
        };

        this.getBusServiceById = function (id, success, error) {
            $http.get(RemoteService.getBaseURL() + '/api/buses/' + id, {cache: true}).success(success).error(error);
        };

        this.searchBusStops = function (searchKey, success, error) {
            return $http.get(RemoteService.getBaseURL() + '/api/stops', {
                params: {
                    q: searchKey,
                    fields: '_id,name'
                }
            }).then(success, error);
        };
    }]);
