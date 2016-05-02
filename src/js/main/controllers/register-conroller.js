'use strict';

angular.module('SGTravelBuddy')

    .controller('RegisterCtrl', ['$scope', '$location', '$translate', 'Authorizer', function ($scope, $location, $translate, Authorizer) {
        $scope.messages = {};
        $scope.loading = false;
        $scope.register = function () {
            if (angular.equals($scope.password, $scope.confirmPassword)) {
                $scope.loading = true;
                Authorizer.register({
                        name: $scope.uname,
                        username: $scope.email,
                        password: $scope.password
                    },
                    function () {
                        $scope.loading = false;
                        $location.path('/');
                    },
                    function (err) {
                        $scope.loading = false;
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