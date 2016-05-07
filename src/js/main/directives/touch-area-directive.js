'use strict';

angular.module('SGTravelBuddy')
    .directive('touchArea', ['$touch', '$filter', function($touch, $filter){
        return {
            restrict: 'A',
            scope: {
                 "touchArea": "="
            },
            link: function($scope, elem) {
                $scope.touch = null;
                $touch.bind(elem, {
                    start: function(touch) {
                    },

                    cancel: function(touch) {
                    },

                    move: function(touch) {
                        var rect = elem[0].getBoundingClientRect();
                        var percentage = (touch.x - rect.left) * 100 / (rect.right - rect.left);
                        if (percentage > 100) percentage = 100;
                        if (percentage < 0) percentage = 0;
                        if (angular.isFunction($scope.touchArea)) {
                          $scope.touchArea($filter('number')(percentage, 2));
                          $scope.$apply();
                        }
                    },

                    end: function(touch) {
                        var rect = elem[0].getBoundingClientRect();
                        var percentage = (touch.x - rect.left) * 100 / (rect.right - rect.left);
                        if (percentage > 100) percentage = 100;
                        if (percentage < 0) percentage = 0;
                        if (angular.isFunction($scope.touchArea)) {
                            $scope.touchArea($filter('number')(percentage, 2));
                            $scope.$apply();
                        }
                    }
                });
            }
        };
    }]);
