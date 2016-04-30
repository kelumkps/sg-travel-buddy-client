'use strict';

angular.module('SGTravelBuddy.auth')
    .factory('Authorizer', ['$rootScope', 'Authenticator', function ($rootScope, Authenticator) {

        var accessLevels = authConfig.accessLevels
            , userRoles = authConfig.userRoles
            , currentUser = JSON.parse(window.localStorage.getItem('user')) || {name: 'Guest', username: '', role: userRoles.public};
        $rootScope.userName = currentUser.name || 'Welcome';

        function changeUser(user) {
            if (user.rememberMe) window.localStorage.setItem('user', JSON.stringify(user));
            else window.localStorage.removeItem('user');
            angular.extend(currentUser, user);
            $rootScope.userName = user.name || 'Welcome';
        }

        return {
            authorize: function (accessLevel, role) {
                if (role === undefined) {
                    role = currentUser.role;
                }
                if (accessLevel == undefined) {
                    return false;
                }
                return accessLevel.bitMask & role.bitMask;
            },
            isLoggedIn: function (user) {
                if (user === undefined) {
                    user = currentUser;
                }
                return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
            },
            register: function (user, success, error) {
                Authenticator.register(user, function (user) {
                    user.role = userRoles[user.role];
                    changeUser(user);
                    success();
                }, error);
            },
            login: function (user, success, error) {
                Authenticator.login(user, function (user) {
                    user.role = userRoles[user.role];
                    changeUser(user);
                    success();
                }, error);
            },
            logout: function (success) {
                Authenticator.logout(function () {
                    changeUser({
                        name: 'Guest',
                        username: '',
                        role: userRoles.public,
                        oauth: {}
                    });
                    success();
                }, currentUser.oauth.refresh_token);
            },
            refreshTokens : function (success, error) {
                Authenticator.refreshTokens(currentUser.oauth.refresh_token, function (res) {
                    currentUser.oauth = res;
                    changeUser(currentUser);
                    success();
                }, error);
            },
            resetPassword : function (email, success, error) {
                Authenticator.resetPassword(email, success, error);
            },
            accessLevels: accessLevels,
            userRoles: userRoles,
            user: currentUser
        };
    }]);