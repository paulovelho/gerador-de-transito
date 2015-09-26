angular
.module("nrt-roads")
.controller("roadController",
function($scope, $interval, $sce){
	
	// variables:
	$scope.size = 30; // cada size unit = 20px. cada pixel = 1.25m. faz as contas, cara.
	$scope.lanes = 3; // 3, 4, 5. nada menor do que 3. somos uma cidade moderna.
	$scope.max_speed = 90; // 30, 60, 90. Nada menor que 30 (Não somos um bando de primitivos). Nada maior que 90 (não estamos na Alemanha).
	$scope.flux = 80; // flux vai ser o nome da minha marca de sabonetes

	$scope.reset = null; // not proud. I'm not a good developer.
	$scope.playing = false; // dá o play, macaco
	$scope.carstotal = 0; // quantos carros passaram aqui?
	$scope.carsnow = 0; // quantos carros tem na rua agora?
	$scope.time = 0; // que horas são?

	// ok... private variables over here... keep moving... keep moving...
	var angular_speed = $scope.max_speed / 30; // angular speed. my personal bit of magic.
	var changingLanes = true;
	var cars_id = 0; // id do carro. que eu uso pra nada. pra nada.
	var breaking_distance = 5; // speed cars starts to slow down
	var updateTime = 300; // frequencia de updates (in ms)

	var map = []; // mapa da via
	var cet = null; // agente que toma conta do transito (Javascripticamente falando: define e cancela o time interval)

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
		$scope.reset = false;
	};

	$scope.elapsedTime = function(){
		var time = Math.floor($scope.time * updateTime/1000);
//		var time = $scope.time;
		var minutes = Math.floor(time/60);
		var seconds = time - (minutes * 60);
		if(minutes == 0) minutes = "";
		if(seconds < 10) seconds = "0" + seconds;
		return minutes + ":" + seconds;
	};

	$scope.build = function(data){
		$scope.lanes = data.lanes;
		$scope.flux = data.flux;
		$scope.max_speed = data.max_speed;
		$scope.size = data.size;
		$scope.setup()
	};

	var TheOddsAre = function(odds){
		odds = odds/100;
		return (Math.random() < odds);
	};

	// function to calculate chance for a car to be slower depending on his lane (from helper.js)
	var chancesToBeSlower = function(l){
//		return 20; // when I want to pretend I control Universe, I just return 20.
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
		var chance = chancesToBeSlower(l);
		if(TheOddsAre(chance)){
			new_speed --;
		}
		return c.start(cars_id, new_speed, l);
	};

	var go = function(){
		function moveCar(car, l, i){
			car = car.move();
			if(car.getI() > $scope.size){
				// car finished
				$scope.carstotal ++;
				map[l][i] = null;
				delete(car);
				return false;
			} else {
				$scope.carsnow ++;
				map[l][i] = null;
				map[l][car.getI()] = car;
				return true;
			}
		};

		function canIMoveLeft(l, i){
			if(!changingLanes) return false;
			if(l == $scope.lanes-1) return false;
			var left = (l+1);
			for(var j=(i-2); j<=(i+1); j++){ // 2 spaces before, one space after
				if( map[left][j] != null){
					return false;	
				} 
			}
			return true;
		}

		function actionCar(car, l, i){
			var distance = lastcar - car.position;
			if(car.speed == 0){
				if( distance > (car.speed + 1) ){
					// car stopped. move it!
					car.speedUp();
				} else {
					// no way to move. Let's try to move the car to left:
					if(canIMoveLeft(l, i)){
						car.changeLane();
						map[l][i] = null;
						map[car.lane][i] = car;
					}
				}
				return car;
			}
			if( car.speed < car.max_speed ){
				// car will try to do something to speed up after moving
				if( moveCar(car, l, i) ){
					if( distance > (car.speed + 1) ){
						if(car.status == "c"){
							car.speedUp();
						}
					} else {
						car.slowDown();
					}
				}
			} else {
				// car at max speed. just move.
				if( moveCar(car, l, i) ){
					car.frontCarAt(lastcar);
				}
			}
			return car;
		};

		// let's go each cell
		$scope.carsnow = 0;
		for(var l=($scope.lanes-1); l>=0; l--){
			var lastcar = $scope.size + breaking_distance;
			for(var i=$scope.size; i>=0; i--){
				var car = map[l][i];
				if(car){
//					console.info("car start: speed="+car.speed+", status="+car.status);
					if(car.status != "x")
						actionCar(car, l, i);
					lastcar = car.position;
//					console.info("car end: speed="+car.speed+", status="+car.status);
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

	$scope.setup = function(){
		angular_speed = $scope.max_speed / 30;
		breaking_distance = angular_speed;
	};

	$scope.resetRoad = function(){
		map = [];
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
		$scope.reset = true;
	};

	var initialize = function(){
		$scope.setup();
		$scope.resetRoad();
	};
	initialize();

// 	for testing with karma, we need to comment these watchers. 
//		TODO: FIX THIS BS.
//	$scope.$watch("[lanes, size]", $scope.resetRoad, true);
//	$scope.$watch("max_speed", $scope.setup, true);


	// test functions:
	this.chancesToBeSlowerFunction = function(lane){ return chancesToBeSlower(lane) };
	this.changingLanes = function(canI){ changingLanes = canI; }
	this.testTimeDisplay = function(time, timeInterval){ 
		$scope.time = time;
		updateTime = timeInterval;
		return $scope.elapsedTime(); 
	}
	this.goFunction = function(){ go(); }
	this.feedMap = function(m){ map = m; }
	this.getMap = function(){ return map; }
})

.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});


