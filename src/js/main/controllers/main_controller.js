'use strict';

angular.module('SGTravelBuddy')

    .controller('MainCtrl', ['$scope', '$location', 'Authorizer', 'NotifierHttpService', 
    	function ($scope, $location, Authorizer, NotifierHttpService) {

        $scope.isLoggedIn = Authorizer.isLoggedIn();
        $scope.logout = function () {
            Authorizer.logout(function () {
                $location.path('/login');
            });
        };

		$scope.messages = {};
        $scope.busStopsToBeNotified = [];
		$scope.$on('notifier:selectedBusStops', function(event, args) {
			console.log('inside main controller on notifier:selectedBusStops', args.selectedStops);
        	angular.copy(args.selectedStops, $scope.busStopsToBeNotified);
        });


        $scope.$on('notifier:busStops', function(event, args) {
		    var nearBusStops = args.nearStops;
		    console.log("Following bus stops are colse to your current location ", nearBusStops);
		    if(nearBusStops.length > 1) {
		        $scope.messages.info = "Following bus stops are colse to your current location \n" + JSON.stringify(nearBusStops);
		    } else {
		        $scope.messages.info = "Following bus stop is colse to your current location \n" + nearBusStops;
		    }

		    nearBusStops.forEach(function (nearStop) {
		        var index = $scope.busStopsToBeNotified.indexOf(nearStop);
		        if (index > -1) {
		            $scope.busStopsToBeNotified.splice(index, 1);
		        }
		    });

		    if ($scope.busStopsToBeNotified.length == 0) {
		        console.log('stopping notifier');
		        NotifierHttpService.stopNotifier();
		    }
		});


    }]);