'use strict';

angular.module('SGTravelBuddy', [
    'ngRoute',
    'mobile-angular-ui',
    'SGTravelBuddy.translator'
])

    .config(function ($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'home.html', reloadOnSearch: false});
    });