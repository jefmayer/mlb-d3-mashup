'use strict';

/*global app */

/**
 * @ngdoc service
 * @name angularYeomanDemoApp.myService
 * @description
 * # myService
 * Service in the angularYeomanDemoApp.
 */
/*http://mlb.mlb.com/gdcross/components/game/mlb/year_2008/month_09/day_02/gid_2008_09_02_phimlb_wasmlb_1/ */
app.service('mlbScoreboardService',function($http, $q) {
	var month,
		day,
		year;
	
	var formatUrl = function() {
		var s = 'http://mlb.mlb.com/gdcross/components/game/mlb/year_' + year + '/month_' + month + '/day_' + day + '/master_scoreboard.json';
		// console.log(s);
		return s;
	};
	
    var service = {
		getData: function($month, $day, $year) {
			month = $month;
			day = $day;
			year = $year;
			
			var deferred = $q.defer();
			
			$http({
				method: 'POST',
				url: formatUrl()
			}).success(function(data) {
				deferred.resolve(data);	
				// console.log(data);
			}).error(function() {
				deferred.reject('There was an error');
			});
			return deferred.promise;
		}
	};
	
	return service;
});

app.service('mlbTeamList',function($http, $q) {
	var service = {
		getData: function() {
			var deferred = $q.defer();
			
			$http({
				method: 'GET',
				url: 'scripts/services/mlb-teams.json'
			}).success(function(data) {
				deferred.resolve(data);	
				// console.log(data);
			}).error(function() {
				deferred.reject('There was an error');
			});
			return deferred.promise;
		}
	};
	
	return service;
});

app.service('mlbScheduleService',function($http, $q) {
	var month,
		day,
		year;
	
	var formatUrl = function() {
		var s = 'http://mlb.mlb.com/gdcross/components/game/mlb/year_' + year + '/month_' + month + '/day_' + day + '/grid.json';
		// console.log(s);
		return s;
	};
	
	var service = {
		getData: function($month, $day, $year) {
			month = $month;
			day = $day;
			year = $year;
			
			var deferred = $q.defer();
			
			$http({
				method: 'POST',
				url: formatUrl()
			}).success(function(data) {
				deferred.resolve(data);	
				// console.log(data);
			}).error(function() {
				deferred.reject('There was an error');
			});
			return deferred.promise;
		}
	};
	
	return service;
});
