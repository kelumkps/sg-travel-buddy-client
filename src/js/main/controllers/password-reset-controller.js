'use strict';

angular.module('SGTravelBuddy')

    .controller('PasswordResetCtrl', ['$scope', '$location', '$translate', 'Authorizer', function ($scope, $location, $translate, Authorizer) {
        $scope.messages = {};
        $scope.loading = false;
        $scope.resetPassword = function () {
            $scope.loading = true;
            Authorizer.resetPassword($scope.email,
                function () {
                    $scope.loading = false;
                    $scope.messages.info = $translate.instant('views.password.reset.success.message1') + $scope.email
                        + $translate.instant('views.password.reset.success.message2');
                },
                function (err, status) {
                    $scope.loading = false;
                    if (status === 404) {
                        $scope.messages.error = $translate.instant('views.password.reset.invalid.email');
                    } else {
                        $scope.messages.error = $translate.instant('views.app.error.service.unavailable');
                    }
                });
        };
    }]);