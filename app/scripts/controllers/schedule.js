'use strict';

/*global app */

/**
 * @ngdoc function
 * @name mlbD3MashupApp.controller:ScheduleCtrl
 * @description
 * # ScheduleCtrl
 * Controller of the mlbD3MashupApp
 */
app.controller('ScheduleCtrl', function ($scope, mlbScheduleService) {
		var months = {
			Jan: '01',
			Feb: '02',
			Mar: '03',
			Apr: '04',
			May: '05',
			Jun: '06',
			Jul: '07',
			Aug: '08',
			Sep: '09',
			Oct: '10',
			Nov: '11',
			Dec: '12'
		};
		
		$scope.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];
		
		$scope.datePicker = {
			value: new Date()
		};
		
		$scope.games = {};

		$scope.onDateChanged = function() {
			var s = $scope.datePicker.value;
			var a = s.toString().split(' ');
						
			mlbScheduleService.getData(months[a[1]],a[2],a[3])
			.then(function(data) {
				$scope.games = data.data.games.game;
				var type = Object.prototype.toString.call($scope.games);
				// If there's only one game, object will not be contained in array
				if (type !== '[object Array]') {
					$scope.games = [$scope.games];
				}
			}, function(data) {
				console.log(data); // Error
			});
		};
		// Run function based on date in range
		$scope.onDateChanged();
	});
