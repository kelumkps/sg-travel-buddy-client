'use strict';

angular.module('SGTravelBuddy')

    .controller('SettingsCtrl', ['$scope', '$location', '$translate', 'Authorizer', function ($scope, $location, $translate, Authorizer) {
        $scope.messages = {};
        $scope.loadingPersonal = false;
        $scope.loadingApp = false;
        $scope.isEditPersonal = false;
        $scope.isEditApp = false;
        $scope.profile = {};
        $scope.profile.isPasswordChanged = false;

        var user = Authorizer.user;
        $scope.profile.name = user.name;
        $scope.email = user.username;
        $scope.distanceValue = user.distance;
        var minDistance = 100;
        var maxDistance = 2500;

        $scope.passwordChanged = function () {
            if ($scope.profile.currentPassword) $scope.profile.isPasswordChanged = true;
            else $scope.profile.isPasswordChanged = false;
        };

        $scope.progressValue = calculatePercentage($scope.distanceValue, minDistance, maxDistance);

        $scope.enableEditPersonal = function () {
            $scope.isEditPersonal = true;
            $scope.messages.info = $translate.instant('views.settings.edit.password.nochange.message');
        };
        $scope.disableEditPersonal = function () {
            $scope.isEditPersonal = false;
        };
        $scope.distanceCallback = function (percentage) {
            if (percentage > 100) percentage = 100;
            $scope.isEditApp = true;
            $scope.progressValue = percentage;
            var updatedDistance = minDistance + ((maxDistance - minDistance) * percentage / 100);
            $scope.distanceValue = Math.round(updatedDistance);
        };

        $scope.updatePersonals = function() {
            var profile = {"name" : $scope.profile.name};
            if ($scope.profile.isPasswordChanged) {
                if (angular.isDefined($scope.profile.newPassword) && angular.equals($scope.profile.newPassword, $scope.profile.confirmPassword)) {
                    $scope.loadingPersonal = true;
                    profile["currentPassword"] = $scope.profile.currentPassword;
                    profile["newPassword"] = $scope.profile.newPassword;
                } else {
                    $scope.messages.error = $translate.instant('views.register.password.invalid');
                    return;
                }
            } else {
                $scope.loadingPersonal = true;
            }
            Authorizer.updateUserProfile(profile, function() {
                $scope.messages.info = $translate.instant('views.settings.update.success.message');
                $scope.loadingPersonal = false;
                $scope.isEditPersonal = false;
                $scope.profile.currentPassword = undefined;
                $scope.profile.newPassword = undefined;
                $scope.profile.confirmPassword = undefined;
                $scope.profile.isPasswordChanged = false;
            }, function(err, status) {
                $scope.loadingPersonal = false;
                if (status === 404) {
                    $scope.messages.error = $translate.instant('views.settings.update.invalid.password.message');
                } else {
                    $scope.messages.error = $translate.instant('views.app.error.service.unavailable');
                }
            });

        };

        $scope.updateAppSettings = function() {
            $scope.loadingApp = true;
            var profile = {"distance" : $scope.distanceValue};
            Authorizer.updateUserProfile(profile, function() {
                $scope.messages.info = $translate.instant('views.settings.update.success.message');
                $scope.loadingApp = false;
                $scope.isEditApp = false;
            }, function(err) {
                $scope.loadingApp = false;
                $scope.messages.error = $translate.instant('views.app.error.service.unavailable');
            });
        };

        function calculatePercentage(distance, minDistance, maxDistance) {
            return (distance - minDistance) * 100 / (maxDistance - minDistance);
        }
    }]);