angular
.module("nrt-roads")
.controller("roadController",
function($scope, $interval, $sce){
	// variables:
	$scope.size = 23;
	$scope.lanes = 3; // 2, 3, 4, 5
	$scope.max_speed = 60; // 30, 60, 90
	$scope.flux = 80;

	$scope.playing = false;
	$scope.carstotal = 0;
	$scope.carsnow = 0;
	$scope.time = 0;

	// ok... private over here
	var angular_speed = $scope.max_speed / 30;
	var cars_id = 0;
	var breaking_distance = 5; // speed cars starts to slow down
	var updateTime = 300;

	var map = [];
	var cet = null;


	$scope.roadShow = function(lane, i){
		var car = map[lane][i];
		if( !car ) return;
		return $sce.trustAsHtml(car.print());
	};
	$scope.playpause = function(){
		if($scope.playing)
			$interval.cancel(cet);
		else
			cet = $interval(go, updateTime);
		$scope.playing = !$scope.playing;
	};

	$scope.elapsedTime = function(){
		var time = Math.floor($scope.time/3);
//		var time = $scope.time;
		var minutes = Math.floor(time/60);
		var seconds = time - minutes;
		if(minutes < 10) minutes = "0" + minutes;
		if(seconds < 10) seconds = "0" + seconds;
		return minutes + ":" + seconds;
	};

	var TheOddsAre = function(odds){
		odds = odds/100;
		return (Math.random() < odds);
	};

	// function to calculate chance for a car to be slower depending on his lane (from helper.js)
	var chanceToBeSlower = function(l){
		var lanes = $scope.lanes;
		if(l > lanes) return 0;
		var chanceToBeSlower = 10; // default = 10% of chance of a slower vehicle;
		if(lanes > 1){
			var minimumChance = 20;
			var degree = 20 / (lanes-1);
			chanceToBeSlower = degree * (lanes-1-l);
		}
		return chanceToBeSlower;
	};

	var newCar = function(l){
		cars_id ++;

		var c = new car();
		var new_speed = angular_speed;
		var chance = chanceToBeSlower(l);
		if(TheOddsAre(chance)){
			new_speed --;
		}
		return c.start(cars_id, new_speed, l);
	};

	var go = function(){
		// let's go each cell
		$scope.carsnow = 0;
		for(var l=0; l<$scope.lanes; l++){
			var lastcar = $scope.size + breaking_distance;
			for(var i=$scope.size; i>=0; i--){
				var car = map[l][i];
				if(car){
					car = car.move();
					if(car.getI() > $scope.size){
						// car finished
						$scope.carstotal ++;
						map[l][i] = null;
						delete(car);
					} else {
						car.frontCarAt(lastcar);
						$scope.carsnow ++;
						map[l][i] = null;
						map[l][car.getI()] = car;
						lastcar = 1;
					}
				} else {
					lastcar ++;
				} 
			}
			if(lastcar > breaking_distance){
				if(TheOddsAre($scope.flux)){
					map[l][0] = newCar(l);
					$scope.carsnow ++;
				}
			}
		}
		$scope.time ++;
	};

	var setup = function(){
		angular_speed = $scope.max_speed / 30;
		breaking_distance = angular_speed;
	};

	var resetRoad = function(){
		for(var i=0;i<$scope.lanes;i++){
			var lane = [];
			for(var j=0;j<$scope.size;j++){
				lane[j] = null;
			}
			map.push(lane)
		}
		$scope.carstotal = 0;
		$scope.carsnow = 0;
		$scope.time = 0;
	};

	var initialize = function(){
		setup();
		resetRoad();
	};
	initialize();

})

.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});


