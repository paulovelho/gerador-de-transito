describe("Road", function(){

	var scope = {};
	var roadController;

	beforeEach(module("nrt-roads"));
	beforeEach(inject(function(_$controller_){
		$controller = _$controller_;
		roadController = $controller("roadController", { $scope: scope });
	}));

	it("os testes tem que funcionar", function(){
		expect(true).to.be.true;
		console.info(roadController);
	});

	describe("HaddadLegalzao", function(){
		it("a marginal existe", function(){
			expect(scope.lanes).to.be.within(1, 5);
		});

		it("chance to be slower deve ser dez se so ha uma lane", function(){
			scope.build({
				lanes: 1, max_speed: 60, size: 5, flux: 50
			});
			expect( roadController.chancesToBeSlowerFunction(0) ).to.be.equal(10);
		});
		it("chance to be slower deve ser 20 na lane da direita e 0 na lane da esquerda, a 90km/h", function(){
			scope.build({
				lanes: 3, max_speed: 90, size: 5, flux: 50
			});
			expect( roadController.chancesToBeSlowerFunction(0) ).to.be.equal(20);
			expect( roadController.chancesToBeSlowerFunction(2) ).to.be.equal(0);
		});

	});

	describe("Transito", function(){

		function createCar(id, speed, lane){
			var c = new car();
			c.start(id, speed, lane);
			return c;
		};

		it("Sabado a tarde - transito ta de boa", function(){
			scope.build({
				lanes: 3, max_speed: 90, size: 5, flux: 50
			});
			var c1 = createCar(1, 3, 0);
			var c2 = createCar(2, 3, 1);
			var c3 = createCar(3, 3, 2);
			var map = [Array(5), Array(5), Array(5)];
			map[0][0] = c1;
			map[1][0] = c2;
			map[2][0] = c3;
			roadController.feedMap(map);
			roadController.goFunction();
			roadController.goFunction();
			var resultMap = roadController.getMap();
			expect(resultMap[0][0]).to.be.equal(null);
			expect(resultMap[1][0]).to.be.equal(null);
			expect(resultMap[2][0]).to.be.equal(null);
			var car = resultMap[1][2];
			expect(car).to.be.an("Object");
			expect(car.speed).to.be.equal(3);
		});
	});



});