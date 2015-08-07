'use strict';

var app = angular.module('SGTravelBuddy', [
    'ngRoute',
    'mobile-angular-ui',
    'SGTravelBuddy.translator',
    'SGTravelBuddy.auth',
    'SGTravelBuddy.travel',
    'SGTravelBuddy.geoLocation',
    'SGTravelBuddy.webSocket'
]);

app.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    var access = authConfig.accessLevels;

    $routeProvider.when('/',
        {
            templateUrl: 'home.html',
            controller: 'MainCtrl',
            access: access.public,
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
            access: access.user,
            reloadOnSearch: false
        });
    $routeProvider.when('/search-bus',
        {
            templateUrl: 'bus-services.html',
            controller: 'BusSearchCtrl',
            access: access.public,
            reloadOnSearch: false
        });
    $routeProvider.when('/bus-service/:busId',
        {
            templateUrl: 'bus.html',
            controller: 'BusCtrl',
            access: access.public,
            reloadOnSearch: false
        });
    $routeProvider.when('/404',
        {
            templateUrl: '404.html',
            access: access.public,
            reloadOnSearch: false
        });
    $routeProvider.otherwise({redirectTo: '/404'});

    //$locationProvider.html5Mode(true); // todo enable this

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

    $httpProvider.interceptors.push(function ($injector) {
        return {
            request: function ($config) {
                var Authorizer = $injector.get("Authorizer");
                $config.headers = $config.headers || {};
                if (Authorizer.isLoggedIn()) {
                    $config.headers.Authorization = 'Bearer ' + Authorizer.user.oauth.access_token;
                }
                return $config;
            }
        };
    });

}]);

app.run(['$rootScope', '$location', '$injector', 'Authorizer', function ($rootScope, $location, $injector, Authorizer) {

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (next && next.$$route.originalPath === ""
            && next.$$route.redirectTo && next.$$route.redirectTo === "/") {
            $location.path('/');
        } else if (!Authorizer.authorize(next.access)) {
            if (Authorizer.isLoggedIn()) $location.path('/');
            else $location.path('/login');
        }
    });

}]);

