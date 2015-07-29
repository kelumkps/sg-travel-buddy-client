'use strict';

angular.module('SGTravelBuddy.auth')
    .factory('Authorizer', ['Authenticator', function (Authenticator /*, $cookieStore*/) {

        var accessLevels = authConfig.accessLevels
            , userRoles = authConfig.userRoles
            , currentUser = /*$cookieStore.get('user') ||*/ {username: '', role: userRoles.public};

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
                Authenticator.register(user, function (res) {
                    user = {
                        username: res.username,
                        role: userRoles[res.role]
                    };
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
            logout: function (success, error) {
                Authenticator.logout(function () {
                    changeUser({
                        username: '',
                        role: userRoles.public
                    });
                    success();
                }, error);
            },
            accessLevels: accessLevels,
            userRoles: userRoles,
            user: currentUser
        };
    }]);