'use strict';

angular.module('SGTravelBuddy.util', [])
    .service('RemoteService', ['$http', '$translate', function ($http, $translate) {
        var baseURL = "https://sg-travelbuddy.rhcloud.com";
        var appVersion = "1.0.0";
        var deviceId;

        this.getBaseURL = function () {
            return baseURL;
        };

        this.sendDeviceInfo = function () {
            if (deviceId == undefined || deviceId === "") {
                var deviceInfo = {
                    cordova: device.cordova,
                    model: device.model,
                    manufacturer: device.manufacturer,
                    platform: device.platform,
                    uuid: device.uuid,
                    osVersion: device.version,
                    isVirtual: device.isVirtual,
                    serial: device.serial,
                    appVersion: appVersion
                };

                $http.post(baseURL + '/api/deviceInfo', deviceInfo).success(function (response) {
                    deviceId = response._id;
                    window.localStorage.setItem('device_id', deviceId);
                    if (angular.isArray(response.notifications) && response.notifications.length > 0) {
                        var notification = response.notifications[0];
                        var buttonName = $translate.instant('views.modal.button.okay');
                        navigator.vibrate(100);
                        navigator.notification.alert(
                            notification['body'],
                            function () {
                            },
                            notification['header'],
                            buttonName
                        );
                    }
                }).error(function (res) {
                });
            }
        };

        this.getDeviceId = function () {
            if (deviceId == undefined) {
                return window.localStorage.getItem('device_id');
            }
            return deviceId;
        };


    }]);