'use strict';

angular.module('SGTravelBuddy')

    .controller('MainCtrl', ['$scope', function ($scope) {
    		var index = 500;
    		$scope.scrollItems = ['4', '5', '6', '28', '59', '19', '81', '101', '120', '150', '293', '489'];
    		$scope.bottomReached = function () {
    			if (index < 800) {
    				index = index + 10;
    				$scope.scrollItems.push(index + '');
    			}
    		}
    }]);