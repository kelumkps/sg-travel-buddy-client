'use strict';

angular.module('SGTravelBuddy.travel', [])
    .controller('BusCtrl', ['$scope', '$translate', 'BusService', function ($scope, $translate, BusService) {
        $scope.messages = {};
        $scope.busServices = [];
        $scope.scrollItems = [];
        $scope.index = 0;
        $scope.bottomReached = function () {
            var arrayLength = $scope.busServices.length;
            var start = $scope.index;
            if(start < arrayLength) {
                var end = (start + 50) > arrayLength ? arrayLength : (start + 50);
                $scope.scrollItems.push.apply($scope.scrollItems, $scope.busServices.slice(start, end));
                $scope.index = end;
            }
        };

        BusService.getBusServiceNumbers(function (res) {
            if (angular.isArray(res)) {
                $scope.busServices = sortArray(res, '_id');
                $scope.bottomReached();
            }
        }, function (res) {
            $scope.scrollItems = [];
            $scope.messages.error = $translate.instant('views.app.error.service.unavailable');
        });
    }]);

function normalizeMixedDataValue(value) {
    var padding = "000000000000000";
    // Loop over all numeric values in the string and
    // replace them with a value of a fixed-width for
    // both leading (integer) and trailing (decimal)
    // padded zeroes.
    value = value.replace(
        /(\d+)((\.\d+)+)?/g,
        function ($0, integer, decimal, $3) {
            // If this numeric value has "multiple"
            // decimal portions, then the complexity
            // is too high for this simple approach -
            // just return the padded integer.
            if (decimal !== $3) {
                return (
                    padding.slice(integer.length) +
                    integer +
                    decimal
                );
            }
            decimal = ( decimal || ".0" );
            return (
                padding.slice(integer.length) +
                integer +
                decimal +
                padding.slice(decimal.length)
            );
        }
    );
    return ( value );
}

function sortArray(array, field) {
    array.sort(
        function (a, b) {
            // Normalize the file names with fixed-
            // width numeric data.
            var aMixed = normalizeMixedDataValue(a[field]);
            var bMixed = normalizeMixedDataValue(b[field]);
            return ( aMixed < bMixed ? -1 : 1 );
        }
    );
    return array;
}