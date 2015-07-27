'use strict';

var app = angular.module('SGTravelBuddy', [
    'ngRoute',
    'mobile-angular-ui',
    'SGTravelBuddy.translator',
    'SGTravelBuddy.auth'
]);

app.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    var access = authConfig.accessLevels;

    $routeProvider.when('/',
        {
            templateUrl: 'home.html',
            controller: 'MainController',
            access: access.user,
            reloadOnSearch: false
        });
    $routeProvider.when('/login',
        {
            templateUrl: 'login.html',
            controller: 'LoginCtrl',
            access: access.guest,
            reloadOnSearch: false
        });
    $routeProvider.when('/register',
        {
            templateUrl: 'register.html',
            controller: 'RegisterCtrl',
            access: access.guest,
            reloadOnSearch: false
        });
    $routeProvider.when('/settings',
        {
            templateUrl: 'settings.html',
            controller: 'RegisterCtrl',
            access: access.public,
            reloadOnSearch: false
        });
    $routeProvider.when('/private',
        {
            templateUrl: 'private.html',
            controller: 'MainController',
            access: access.user,
            reloadOnSearch: false
        });
    $routeProvider.when('/404',
        {
            templateUrl: '404.html',
            access: access.public,
            reloadOnSearch: false
        });
    $routeProvider.otherwise({redirectTo: '/404'});

    //$locationProvider.html5Mode(true);  todo enable this

    $httpProvider.interceptors.push(function ($q, $location) {
        return {
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/login');
                    return $q.reject(response);
                }
                else {
                    return $q.reject(response);
                }
            }
        }
    });

}]);

app.run(['$rootScope', '$location', 'Authorizer', function ($rootScope, $location, Authorizer) {

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        $rootScope.error = null;
        if (!Authorizer.authorize(next.access)) {
            if (Authorizer.isLoggedIn()) $location.path('/');
            else $location.path('/login');
        }
    });

}]);

