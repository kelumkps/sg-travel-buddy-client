'use strict';

angular.module('SGTravelBuddy.auth', [])
    .service('Authenticator', ['$http', function ($http) {
        this.login = function (user, success, error) {
            $http.post('/login', user).success(function (res) {
                success(res);
            }).error(error);
        };

        this.register = function (user, success, error) {
            $http.post('/register', user).success(function (user) {
                success(user);
            }).error(error);
        };

        this.logout = function (success, error) {
            $http.post('/logout').success(success).error(error);
        };
    }]);