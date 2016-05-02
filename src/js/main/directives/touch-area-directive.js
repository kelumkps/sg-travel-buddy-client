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
                        $scope.progressValue = (touch.x - rect.left) * 100 / (rect.right - rect.left);
                        if (angular.isFunction($scope.touchArea)) {
                          $scope.touchArea($filter('number')($scope.progressValue, 2));
                          $scope.$apply();
                        }
                    },

                    end: function(touch) {
                        var rect = elem[0].getBoundingClientRect();
                        $scope.progressValue = (touch.x - rect.left) * 100 / (rect.right - rect.left);
                        if (angular.isFunction($scope.touchArea)) {
                            $scope.touchArea($filter('number')($scope.progressValue, 2));
                            $scope.$apply();
                        }
                    }
                });
            }
        };
    }]);
