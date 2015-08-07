'use strict';

angular.module('SGTravelBuddy.travel')
    .controller('StopSearchCtrl', ['$scope', '$filter', '$translate', 'BusService', function ($scope, $filter, $translate, BusService) {
        $scope.messages = {};
        $scope.searchBusStops = function (searchKey) {
            return BusService.searchBusStops(searchKey, function (response) {
                return response.data.map(function (stop) {
                    stop['displayName'] = stop._id + ' - ' + stop.name;
                    return stop;
                });
            }, function (err) {
                $scope.scrollItems = [];
                $scope.messages.error = $translate.instant('views.app.error.service.unavailable');
            });
        };

    }]);
