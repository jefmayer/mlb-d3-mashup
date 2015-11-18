'use strict';

/**
 * @ngdoc overview
 * @name mlbD3MashupApp
 * @description
 * # mlbD3MashupApp
 *
 * Main module of the application.
 */
var app = angular.module('mlbD3MashupApp',[
	'ngAnimate',
	'ngCookies',
	'ngResource',
	'ngRoute',
	'ngSanitize',
	'ngTouch'
]);
app.config(function ($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/main.html',
		controller: 'MainCtrl'
	})
	.when('/schedule', {
		templateUrl: 'views/schedule.html',
		controller: 'ScheduleCtrl'
	})
	.when('/stats', {
		templateUrl: 'views/stats.html',
		controller: 'StatsCtrl'
	})
		.otherwise({
		redirectTo: '/'
	});
});