'use strict';

angular.module('SGTravelBuddy')

    .controller('RegisterCtrl', ['$scope', '$location', '$translate', 'Authorizer', function ($scope, $location, $translate, Authorizer) {
        $scope.messages = {};
        $scope.rememberMe = false;
        $scope.register = function () {
            if ($scope.password === $scope.confirmPassword) {
                Authorizer.register({
                        name: $scope.uname,
                        username: $scope.email,
                        password: $scope.password
                    },
                    function () {
                        $location.path('/');
                    },
                    function (err) {
                        if (err === 'user_already_exist_error') {
                            $scope.messages.error = $translate.instant('views.register.user.exists');
                        }
                        else {
                            $scope.messages.error = JSON.stringify(err);
                        }
                    });
            } else {
                $scope.messages.error = $translate.instant('views.register.password.invalid');
            }
        };
    }]);