'use strict';

angular.module('SGTravelBuddy.auth', [])
    .service('Authenticator', ['$http', function ($http) {
        this.login = function (user, success, error) {
            var authData = {
                "grant_type": "password",
                "client_id": "sg-travel-buddy-v1",
                "client_secret": "welcome1",
                "username": user.username,
                "password": user.password
            };
            $http.post('/oauth2/token', authData).success(function (res) {
                var accessToken = res.access_token;
                var refreshToken = res.refresh_token;
                var userProfileReq = {
                    method: 'GET',
                    url: '/api/users',
                    headers: {
                        'Authorization': 'Bearer ' + res.access_token
                    }
                };
                $http(userProfileReq).success(function (profile) {
                    profile.oauth = res;
                    success(profile);
                }).error(error);
            }).error(error);
        };

        this.register = function (user, success, error) {
            $http.post('/api/users', user).success(function (user) {
                success(user);
            }).error(error);
        };

        this.logout = function (success, error) {
            $http.post('/logout').success(success).error(error);
        };
    }]);