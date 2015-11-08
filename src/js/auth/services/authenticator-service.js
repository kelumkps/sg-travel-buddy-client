'use strict';

angular.module('SGTravelBuddy.auth', ['ngCookies'])
    .service('Authenticator', ['$http', function ($http) {
        this.login = function (user, success, error) {
            var authData = {
                "grant_type": "password",
                "client_id": "sg-travel-buddy-v1",
                "client_secret": "welcome1",
                "username": user.username,
                "password": user.password
            };
            $http.post('/oauth2/token', authData, {ignoreAuthModule: true}).success(function (res) {
                var userProfileReq = {
                    method: 'GET',
                    url: '/api/users',
                    headers: {
                        'Authorization': 'Bearer ' + res.access_token
                    }
                };
                $http(userProfileReq).success(function (profile) {
                    profile.oauth = res;
                    profile.rememberMe = user.rememberMe;
                    success(profile);
                }).error(error);
            }).error(error);
        };

        this.register = function (user, success, error) {
            var authData = {
                "grant_type": "password",
                "client_id": "sg-travel-buddy-v1",
                "client_secret": "welcome1",
                "username": user.username,
                "password": user.password
            };
            $http.post('/api/users', user, {ignoreAuthModule: true}).success(function (profile) {
                $http.post('/oauth2/token', authData).success(function (res) {
                    profile.oauth = res;
                    success(profile);
                }).error(error);
            }).error(error);
        };

        this.logout = function (success, refreshToken) {
            $http.get('/oauth2/revoke', {params: {token: refreshToken}, ignoreAuthModule: true}).success(success).error(success);
        };

        this.refreshTokens = function (refreshToken, success, error) {
            var authData = {
                "grant_type": "refresh_token",
                "client_id": "sg-travel-buddy-v1",
                "client_secret": "welcome1",
                "refresh_token": refreshToken
            };
            $http.post('/oauth2/token', authData, {ignoreAuthModule: true}).success(success).error(error);
        };
    }]);