'use strict';

/*global app */

/**
 * @ngdoc function
 * @name mlbD3MashupApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mlbD3MashupApp
 */
app.controller('StatsCtrl', function ($scope, mlbScoreboardService, mlbTeamList) {
	var startDate = new Date('April 5, 2015'),
		date = startDate, // One previous to actual start day
		dateArr = [],
		endDate = new Date('April 12, 2015'),
		// endDate = new Date(),
		endDateArr = endDate.toString().split(' '),
		months = {
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
		},
		teamList = [],
		seasonLen = 7;
	
	var vis = d3.select('#visualization'),
		WIDTH = 700,
		HEIGHT = 700,
		MARGINS = {
			top: 20,
			right: 20,
			bottom: 20,
			left: 50
		};
	
	var day = 0;
	
	$scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    $scope.teams = [];
    
    function init() {
	    // Get teams
	    mlbTeamList.getData()
		.then(function(data) {
			teamList = data;
		}, function(data) {
			console.log(data); // Error
		});
		updateDate();
    }
	
	function updateDate() {
		// First run
		if (dateArr.length !== 0) {
			date.setDate(date.getDate() + 1);
		}
		dateArr = date.toString().split(' ');
		console.log(dateArr);
		console.log(endDateArr);
		pullData();
	}
	
	function displayData() {
		var dataGroup = d3.nest()
			.key(function(d) {
				return d.name;
			})
			.entries($scope.teams),
		
			xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([0,seasonLen]),
			yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0,seasonLen]),
		
			lineGen = d3.svg.line()
				.x(function(d) {
					return xScale(d.date);
				})
				.y(function(d) {
					return yScale(d.wins);
				})
				.interpolate('basis'),
			
			xAxis = d3.svg.axis().scale(xScale),
			yAxis = d3.svg.axis().scale(yScale);
			
		vis.append('svg:g').call(yAxis)
			.attr('class', 'axis')
			.attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
			.call(xAxis);
					
		yAxis = d3.svg.axis()
			.scale(yScale)
			.orient('left');
		
		vis.append('svg:g')
			.attr('class', 'axis')
			.attr('transform', 'translate(' + (MARGINS.left) + ',0)')
			.call(yAxis);
		
		var x = d3.time.scale()
		    .range([0, WIDTH]);
		
		var y = d3.scale.linear()
		    .range([HEIGHT, 0]);
		    
		var bisectDate = d3.bisector(function(d) { return d.date; }).left;
		
		// Did team play?
		// If not need to give team the same score for day as previous day
		for (var team in dataGroup) {
			team = dataGroup[team];
			team.color = getTeamColor(team.key);
			for (var j = 0; j < day; j++) {
				if (team.values[j] !== undefined) {
					if (team.values[j].date > j) {
						// Insert record of the same win amount here
						var record;
						// If missing the first record
						if (j === 0) {
							record = team.values[j];
							team.values.splice(j, 0, {name:record.name, wins:'0', date:j});
						} else {
							record = team.values[j - 1];
							team.values.splice(j, 0, {name:record.name, wins:record.wins, date:j});
						}
					}
				} 
				// console.log(team.values[j]);
			}
		}
		console.log(dataGroup);
		
		// http://bl.ocks.org/mbostock/8033015
		
		dataGroup.forEach(function(d, i) {
			vis.append('svg:path')
			    .attr('d', lineGen(d.values))
			    .attr('stroke', d.color)
			    .attr('stroke-width', 0.5)
			    .attr('fill', 'none');
			    
			var focus = vis.append('g')
			.attr('class', 'focus')
			.style('display', 'none');
			
			focus.append('circle')
			.attr('r', 4.5);
			
			focus.append('text')
			.attr('x', 9)
			.attr('dy', '.35em');
			
			vis.append('rect')
			.attr('class', 'overlay')
			.attr('width', WIDTH)
			.attr('height', HEIGHT)
			.on('mouseover', function() { focus.style('display', null); })
			.on('mouseout', function() { focus.style('display', 'none'); })
			.on('mousemove', mousemove);
			
			function mousemove() {
				var x0 = x.invert(d3.mouse(this)[0]),
				i = bisectDate(d.values, x0, 1),
				d0 = d.values[i - 1],
				d1 = d.values[i],
				e = x0 - d0.date > d1.date - x0 ? d1 : d0;
				console.log(e.date + ', ' + e.wins);
				focus.attr('transform', 'translate(' + x(e.date) + ',' + y(e.wins) + ')');
				//focus.select('text').text(formatCurrency(d.wins));
			}
		});
		
		
	}
	
	function getTeamColor(name) {
		for (var i = 0; i < teamList.length; i++) {
			if (name === teamList[i].team) {
				return '#' + teamList[i].colors.hex[0];
			}
		}
		return 'gray';
	}
	
	function pullData() {
		mlbScoreboardService.getData(months[dateArr[1]],dateArr[2],dateArr[3])
		.then(function(data) {
			var games = data.data.games.game;
			var type = Object.prototype.toString.call(games);
				// If there's only one game, object will not be contained in array
				if (type !== '[object Array]') {
					games = [games];
				}
			var g;
			console.log(data);
			for (var i = 0; i <= games.length; i++) {
				g = games[i];
				if (g !== undefined) {
					if (g.home_team_city === 'NY Yankees' || g.home_team_city === 'NY Mets') {
						g.home_team_city = 'New York';
					}
					if (g.away_team_city === 'NY Yankees' || g.away_team_city === 'NY Mets') {
						g.away_team_city = 'New York';
					}
					if (g.home_team_city === 'Chi Cubs' || g.home_team_city === 'Chi White Sox') {
						g.home_team_city = 'Chicago';
					}
					if (g.away_team_city === 'Chi Cubs' || g.away_team_city === 'Chi White Sox') {
						g.away_team_city = 'Chicago';
					}
					if (g.home_team_city === 'LA Angels' || g.home_team_city === 'LA Dodgers') {
						g.home_team_city = 'Los Angeles';
					}
					if (g.away_team_city === 'LA Angels' || g.away_team_city === 'LA Dodgers') {
						g.away_team_city = 'Los Angeles';
					}
					if (g.home_team_name === 'D-backs' || g.home_team_city === 'D-backs') {
						g.home_team_name = 'Diamondbacks';
					}
					$scope.teams.push(
						{
							name: g.home_team_city + ' ' + g.home_team_name,
							wins: g.home_win,
							date: day
						}
						,{
							name: g.away_team_city + ' ' + g.away_team_name,
							wins: g.away_win,
							date: day
						}
					);
				}
			}
			// At end of schedule
			if (isEndOfSchedule()) {
				displayData();
			} else {
				day = day + 1;
				updateDate();
			}
		}, function(data) {
			console.log(data); // Error
		});
	}
	
	function isEndOfSchedule() {
		var bool;
		if (dateArr[1] === endDateArr[1] && dateArr[2] === endDateArr[2] && dateArr[3] === endDateArr[3]) {
			bool = true;
		} else {
			bool = false;
		}
		return bool;
	}
	
	// Kickoff
	init();
  });
