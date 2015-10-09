angular
.module("nrt-roads")
.controller("dualController",
function($scope, $sce){

	$scope.lanes = 3;
	$scope.size = 30;
	$scope.flux = 80;
	$scope.reset = true;
	$scope._time = "";
	$scope.playing = false;
	$scope.auto_pause = false;

	$scope.avoidUnexpectedBehaviour = false;
	$scope.gargalo = false;

	$scope.$watch("size", function(){ $scope.$broadcast("set-size", $scope.size); });
	$scope.$watch("flux", function(){ $scope.$broadcast("set-flux", $scope.flux); });
	$scope.$watch("lanes", function(){ $scope.$broadcast("set-lanes", $scope.lanes); });

	$scope.$watch("auto_pause", function(){ $scope.$broadcast("auto-pause", $scope.auto_pause); });
	$scope.$watch("gargalo", function(){ $scope.$broadcast("set-gargalo", $scope.gargalo); });
	$scope.$watch("avoidUnexpectedBehaviour", function(){ $scope.$broadcast("mundo-ideal", $scope.avoidUnexpectedBehaviour); });



	$scope.resetRoad = function(){
		$scope.$broadcast("reset-road");
		$scope.reset = true;
	}
	$scope.playpause = function(){
		$scope.reset = false;
		$scope.$broadcast("play-pause");
	}

	var initialize = function(){
	};
	initialize();

});
