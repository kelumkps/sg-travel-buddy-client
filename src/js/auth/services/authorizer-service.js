'use strict';

angular.module('SGTravelBuddy.auth')
    .factory('Authorizer', ['Authenticator', function (Authenticator /*, $cookieStore*/) {

        var accessLevels = authConfig.accessLevels
            , userRoles = authConfig.userRoles
            , currentUser = /*$cookieStore.get('user') ||*/ {name: 'Guest', username: '', role: userRoles.public};

        /*$cookieStore.remove('user');*/

        function changeUser(user) {
            angular.extend(currentUser, user);
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
            accessLevels: accessLevels,
            userRoles: userRoles,
            user: currentUser
        };
    }]);