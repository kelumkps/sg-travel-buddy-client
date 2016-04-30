'use strict';

var app = angular.module('SGTravelBuddy', [
    'ngRoute',
    'mobile-angular-ui',
    'http-auth-interceptor',
    'SGTravelBuddy.cordova',
    'SGTravelBuddy.util',
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
    $routeProvider.when('/password-reset',
        {
            templateUrl: 'forgot-password.html',
            controller: 'PasswordResetCtrl',
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
    $routeProvider.when('/search-stops',
        {
            templateUrl: 'stop-search.html',
            controller: 'StopSearchCtrl',
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

    $httpProvider.interceptors.push(function ($injector) {
        return {
            request: function ($config) {
                var Authorizer = $injector.get("Authorizer");
                $config.headers = $config.headers || {};
                if (Authorizer.isLoggedIn()) {
                    $config.headers.Authorization = 'Bearer ' + Authorizer.user.oauth.access_token;
                }
                var RemoteService = $injector.get("RemoteService");
                var deviceId = RemoteService.getDeviceId();
                if (deviceId != undefined && deviceId  != "") {
                    $config.headers['device-id'] = deviceId;
                }
                return $config;
            }
        };
    });

}]);

app.run(['$rootScope', '$location', 'Authorizer', 'authService', 'deviceReady', 'NotifierHttpService', '$translate', 'RemoteService',
    function ($rootScope, $location, Authorizer, authService, deviceReady, NotifierHttpService, $translate, RemoteService) {

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if (next && next.$$route.originalPath === ""
                && next.$$route.redirectTo && next.$$route.redirectTo === "/") {
                $location.path('/');
            } else if (!Authorizer.authorize(next.access)) {
                if (Authorizer.isLoggedIn()) {
                    $location.path('/');
                } else {
                    $location.path('/login');
                    window.plugins.toast.showShortCenter($translate.instant('view.app.login.required.message'));
                }
            }
        });

        $rootScope.$on('event:auth-loginRequired', function () {
            Authorizer.refreshTokens(function () {
                authService.loginConfirmed();
            }, function () {
                $location.path('/login');
            });
        });

        $rootScope.$on('event:auth-forbidden', function () {
            Authorizer.logout(function () {
                $location.path('/login');
            });
        });

        deviceReady(function () {
            RemoteService.sendDeviceInfo();
            document.addEventListener("backbutton", function (e) {
                if ($location.path() == '/') {
                    if (NotifierHttpService.isNotifierOn()) {
                        navigator.notification.confirm($translate.instant('views.app.exit.message'), function (result) {
                            if (result == 1) {
                                e.preventDefault();
                                navigator.app.exitApp();
                            } else {
                                window.plugins.toast.showShortBottom($translate.instant('views.app.go.background.message'));
                            }
                        });
                    } else {
                        e.preventDefault();
                        navigator.app.exitApp();
                    }
                } else {
                    navigator.app.backHistory();
                }
            }, false);

            document.addEventListener("online", function () {
                RemoteService.sendDeviceInfo();
            }, false);

            document.addEventListener("offline", function () {
                window.plugins.toast.showShortBottom($translate.instant('views.app.go.offline.message'));
            }, false);
        });

        function checkForExit() {
            return ($location.path() == '/' && NotifierHttpService.isNotifierOn());
        }

    }]);

