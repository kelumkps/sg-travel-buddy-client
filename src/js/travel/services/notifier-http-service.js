'use strict';

angular.module('SGTravelBuddy.travel')
    .service('NotifierHttpService', ['$rootScope', '$http', '$interval', 'getCurrentPosition', 'Authorizer',
     function ($rootScope, $http, $interval, getCurrentPosition, Authorizer) {
    	var selectedBusStops = [];
    	var hasUpdates = false;
    	var interval;

    	this.createNotifier = function(success, error) {
			if (selectedBusStops.length > 0) {
    			getCurrentPosition(function(position) {
    				console.log(position);
    				var lat = position.coords.latitude; 
      				var lng = position.coords.longitude;
      				var coordinates = [lng, lat];
      				var routeData = {
            			coordinates: coordinates
        			};
        			if (hasUpdates) routeData['busStops'] = selectedBusStops;
					$http.post('/api/routes', routeData).success(success).error(error);        			
  				});
    		}
    	};

    	this.startNotifier = function (routeId, error) {
    		if (selectedBusStops.length > 0) {
				interval = $interval(function() {
				  	getCurrentPosition(function(position) {
	    				console.log('geo position>>>>>>', position);
	    				var lat = position.coords.latitude; 
	      				var lng = position.coords.longitude;
	      				var coordinates = [lng, lat];
	      				var routeData = {
	            			coordinates: coordinates
	        			};
	        			if (hasUpdates) {
	        				routeData['busStops'] = selectedBusStops;
	        				hasUpdates = false;
	        			}
	        			updateRouteData(routeId, routeData, error);
	  				});
				}, 5000, 1400);
    		}
    	};

    	this.stopNotifier = function() {
    		if (interval) {
    			$interval.cancel(interval);
    			$rootScope.$broadcast('notifier:stopNotifier');
    		}
    	};

		this.updateSelectedBusStops = function(list) {
			if (list.length > 0) {
				selectedBusStops = list;
				hasUpdates = true;
			} else {
				hasUpdates = false;
				this.stopNotifier();
			}
    	};

    	function updateRouteData(routeId, routeData, error) {
			$http.put('/api/routes/' + routeId, routeData).success(function (nearBusStops) {
				console.log('updated route nearBusStops >>>', nearBusStops);
				var matchedNearBusStops = [];
				var isArray = angular.isArray(nearBusStops);
				selectedBusStops.forEach(function (stop) {
					if (isArray) {
						nearBusStops.forEach(function (nearStop) {
							if (nearStop._id === stop) matchedNearBusStops.push(stop);
						});
					} else if (nearBusStops._id === stop) {
						matchedNearBusStops.push(stop);
					}				        
			    });

			    console.log('matches>>>>>>>>>>>>>', matchedNearBusStops);
		        if (matchedNearBusStops.length > 0) {
		        	$rootScope.$broadcast('notifier:busStops', { nearStops: matchedNearBusStops });
		        }				
			}).error(error);
    	};
        
    }]);