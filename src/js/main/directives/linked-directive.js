'use strict';

angular.module('SGTravelBuddy')
    .directive("linked", function () {
        return function (scope, element, attrs) {
            var id = attrs["linked"];
            element.on("click", function () {
                document.getElementById(id).click();
            });
        };
    });
