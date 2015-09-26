describe("Road", function(){

	var scope = {};
	var roadController;

	beforeEach(module("nrt-roads"));
	beforeEach(inject(function(_$controller_){
		$controller = _$controller_;
		roadController = $controller("roadController", { $scope: scope });
	}));

	it("os testes tem que funfar", function(){
		expect(true).to.be.true;
	});

	describe("HaddadLegalzao", function(){
		it("a marginal existe", function(){
			expect(scope.lanes).to.be.within(1, 5);
		});

		it("if I could save time in a bottle...", function(){
			var show_time;
			show_time = roadController.testTimeDisplay("60", 1000);
			expect(show_time).to.be.equal("1:00");
			show_time = roadController.testTimeDisplay("60", 500);
			expect(show_time).to.be.equal(":30");
			show_time = roadController.testTimeDisplay("600", 500);
			expect(show_time).to.be.equal("5:00");
			show_time = roadController.testTimeDisplay("600", 250);
			expect(show_time).to.be.equal("2:30");
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
			var map = [Array(5), Array(5), Array(5)];
			var c1 = createCar(1, 3, 0);
			var c2 = createCar(2, 3, 1);
			var c3 = createCar(3, 3, 2);
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

		it("Olha ali o carro parado... ve se ele anda", function(){
			var debug = false;
			scope.build({
				lanes: 3, max_speed: 90, size: 5, flux: 0
			});
			var map = [Array(5), Array(5), Array(5)];
			var c1 = createCar(1, 3, 1);
			c1.hardBreak();
			var nothing, car;
			map[1][0] = c1;
			roadController.feedMap(map);

			if(debug) console.info("t=0");
			car = roadController.getMap()[1][0];
			expect(car).to.be.an("object");
			expect(car.speed).to.be.equal(0);
			expect(car.position).to.be.equal(0);

			if(debug) console.info("t=1");
			roadController.goFunction();
			car = roadController.getMap()[1][0];
			expect(car).to.be.an("object");
			expect(car.speed).to.be.equal(1);
			expect(car.position).to.be.equal(0);

			if(debug) console.info("t=2");
			roadController.goFunction();
			car = roadController.getMap()[1][0];
			expect(car).to.be.an("object");
			expect(car.speed).to.be.equal(1);
			expect(car.position).to.be.equal(0.33);

			if(debug) console.info("t=3");
			roadController.goFunction();
			car = roadController.getMap()[1][0];
			expect(car).to.be.an("object");
			expect(car.speed).to.be.equal(2);
			expect(car.position).to.be.equal(0.66);

			if(debug) console.info("t=4");
			roadController.goFunction();
			nothing = roadController.getMap()[1][0];
			expect(nothing).to.be.null;
			car = roadController.getMap()[1][1];
			expect(car).to.be.an("object");
			expect(car.speed).to.be.equal(2);

			if(debug) console.info("t=5");
			roadController.goFunction();
			nothing = roadController.getMap()[1][1];
			expect(nothing).to.be.null;
			car = roadController.getMap()[1][2];
			expect(car).to.be.an("object");
			expect(car.speed).to.be.equal(3);

			if(debug) console.info("t=6");
			roadController.goFunction();
			nothing = roadController.getMap()[1][2];
			expect(nothing).to.be.null;
			car = roadController.getMap()[1][3];
			expect(car).to.be.an("object");
			expect(car.speed).to.be.equal(3);

			if(debug) console.info("t=7");
			roadController.goFunction();
			nothing = roadController.getMap()[1][3];
			expect(nothing).to.be.null;
			car = roadController.getMap()[1][4];
			expect(car).to.be.an("object");
			expect(car.speed).to.be.equal(3);

		});

		it("Se um carro quebra, o carro de tras para", function(){
			var debug = false;
			scope.build({
				lanes: 3, max_speed: 90, size: 5, flux: 0
			});
			var map = [Array(5), Array(5), Array(5)];
			// sets broken car:
			var broken = createCar(1, 3, 1);
			broken.setPosition(4);
			broken.broken();
			map[1][4] = broken;
			// sets moving car:
			var movingone = createCar(2, 3, 1);
			map[1][0] = movingone;
			roadController.feedMap(map);
			roadController.changingLanes(false);

			var car1, car2;

			if(debug) console.info("t=0");
			car1 = roadController.getMap()[1][0];
			expect(car1.speed).to.be.equal(3);
			expect(car1.position).to.be.equal(0);
			car2 = roadController.getMap()[1][4];
			expect(car2.speed).to.be.equal(0);
			expect(car2.position).to.be.equal(4);

			if(debug) console.info("t=1");
			roadController.goFunction();
			car1 = roadController.getMap()[1][1];
			expect(car1.speed).to.be.equal(3);
			expect(car1.position).to.be.equal(1);
			car2 = roadController.getMap()[1][4];
			expect(car2.speed).to.be.equal(0);
			expect(car2.position).to.be.equal(4);

			if(debug) console.info("t=2");
			roadController.goFunction();
			car1 = roadController.getMap()[1][2];
			expect(car1.speed).to.be.equal(2);
			expect(car1.position).to.be.equal(2);
			car2 = roadController.getMap()[1][4];
			expect(car2.speed).to.be.equal(0);
			expect(car2.position).to.be.equal(4);

			if(debug) console.info("t=3");
			roadController.goFunction();
			car1 = roadController.getMap()[1][2];
			expect(car1.speed).to.be.equal(1);
			expect(car1.position).to.be.equal(2.66);
			car2 = roadController.getMap()[1][4];
			expect(car2.speed).to.be.equal(0);
			expect(car2.position).to.be.equal(4);

			if(debug) console.info("t=4");
			roadController.goFunction();
			car1 = roadController.getMap()[1][3];
			expect(car1.speed).to.be.equal(0);
			expect(car1.position).to.be.equal(3);
			expect(car1.getI()).to.be.equal(3);
			car2 = roadController.getMap()[1][4];
			expect(car2.speed).to.be.equal(0);
			expect(car2.position).to.be.equal(4);

			if(debug) console.info("t=5");
			roadController.goFunction();
			car1 = roadController.getMap()[1][3];
			expect(car1.speed).to.be.equal(0);
			expect(car1.getI()).to.be.equal(3);
			car2 = roadController.getMap()[1][4];
			expect(car2.speed).to.be.equal(0);
			expect(car2.position).to.be.equal(4);
		});

		it("Motorista prudente nao troca de faixa sem dar seta", function(){
			var debug = false;
			scope.build({
				lanes: 3, max_speed: 90, size: 15, flux: 0
			});
			var map = [Array(15), Array(15), Array(15)];
			var nothing, car1, car2, carbroken;

			car1 = createCar(1, 3, 0);
			car1.position = 6;
			car1.hardBreak();
			map[0][6] = car1;
			car2 = createCar(2, 3, 1);
			car2.position = 4;
			map[1][4] = car2;
			carbroken = createCar(4, 3, 1);
			carbroken.broken();
			carbroken.position = 7;
			map[0][7] = carbroken;

			roadController.feedMap(map);

			if(debug) console.info("t=0");
			car1 = car2 = carbroken = null;
			car1 = roadController.getMap()[0][6];
			expect(car1).to.be.an("object");
			expect(car1.speed).to.be.equal(0);
			expect(car1.position).to.be.equal(6);
			car2 = roadController.getMap()[1][4];
			expect(car2).to.be.an("object");
			expect(car2.speed).to.be.equal(3);
			expect(car2.position).to.be.equal(4);
			carbroken = roadController.getMap()[0][7];
			expect(carbroken).to.be.an("object");
			expect(carbroken.speed).to.be.equal(0);
			expect(carbroken.status).to.be.equal("x");
			expect(carbroken.position).to.be.equal(7);

			if(debug) console.info("t=1");
			car1 = car2 = carbroken = null;
			roadController.goFunction();
			car1 = roadController.getMap()[0][6];
			expect(car1.speed).to.be.equal(0);
			expect(car1.position).to.be.equal(6);
			car2 = roadController.getMap()[1][5];
			expect(car2.speed).to.be.equal(3);
			expect(car2.position).to.be.equal(5);

			if(debug) console.info("t=2");
			car1 = car2 = carbroken = null;
			roadController.goFunction();
			car1 = roadController.getMap()[0][6];
			expect(car1.speed).to.be.equal(0);
			expect(car1.position).to.be.equal(6);
			nothing = roadController.getMap()[1][5];
			expect(nothing).to.be.null;
			car2 = roadController.getMap()[1][6];
			expect(car2.speed).to.be.equal(3);
			expect(car2.position).to.be.equal(6);

			if(debug) console.info("t=3");
			car1 = car2 = carbroken = null;
			roadController.goFunction();
			car1 = roadController.getMap()[0][6];
			expect(car1).to.be.an("object");
			expect(car1.speed).to.be.equal(0);
			expect(car1.position).to.be.equal(6);
			car2 = roadController.getMap()[1][7];
			expect(car2).to.be.an("object");
			expect(car2.speed).to.be.equal(3);
			expect(car2.position).to.be.equal(7);
			carbroken = roadController.getMap()[0][7];
			expect(carbroken).to.be.an("object");
			expect(carbroken.speed).to.be.equal(0);
			expect(carbroken.status).to.be.equal("x");
			expect(carbroken.position).to.be.equal(7);

			if(debug) console.info("t=4 , ou a troca de faixa");
			car1 = car2 = carbroken = null;
			roadController.goFunction();
			car2 = roadController.getMap()[1][8];
			expect(car2).to.be.an("object");
			expect(car2.speed).to.be.equal(3);
			expect(car2.position).to.be.equal(8);
			carbroken = roadController.getMap()[0][7];
			expect(carbroken.speed).to.be.equal(0);
			expect(carbroken.status).to.be.equal("x");
			expect(carbroken.position).to.be.equal(7);
			nothing = roadController.getMap()[0][6];
			expect(nothing).to.be.null;
			car1 = roadController.getMap()[1][6];
			expect(car1).to.be.an("object");
			expect(car1.speed).to.be.equal(0);

			if(debug) console.info("t=5 , ou a vida continua");
			car1 = car2 = carbroken = null;
			roadController.goFunction();
			carbroken = roadController.getMap()[0][7];
			expect(carbroken.speed).to.be.equal(0);
			expect(carbroken.status).to.be.equal("x");
			expect(carbroken.position).to.be.equal(7);
			nothing = roadController.getMap()[0][6];
			expect(nothing).to.be.null;
			car1 = roadController.getMap()[1][6];
			expect(car1).to.be.an("object");
			expect(car1.status).to.be.equal("a");
			expect(car1.speed).to.be.equal(1);
		});

		it("Quinta de manha - carro quebrado e o escambau", function(){
			var debug = false;
			scope.build({
				lanes: 3, max_speed: 90, size: 15, flux: 0
			});
			var map = [Array(15), Array(15), Array(15)];
			var nothing, car1, car2, car3, carbroken;

			car1 = createCar(1, 3, 0);
			car1.position = 6;
			car1.hardBreak();
			map[0][6] = car1;
			car2 = createCar(2, 3, 1);
			car2.position = 5;
			map[1][5] = car2;
			car3 = createCar(3, 3, 1);
			car3.position = 0;
			map[1][0] = car3;
			carbroken = createCar(4, 3, 1);
			carbroken.broken();
			carbroken.position = 7;
			map[0][7] = carbroken;

			roadController.feedMap(map);

			if(debug) console.info("t=0");
			car1 = car2 = car3 = carbroken = null;
			car1 = roadController.getMap()[0][6];
			expect(car1).to.be.an("object");
			expect(car1.speed).to.be.equal(0);
			expect(car1.position).to.be.equal(6);
			car2 = roadController.getMap()[1][5];
			expect(car2).to.be.an("object");
			expect(car2.speed).to.be.equal(3);
			expect(car2.position).to.be.equal(5);
			car3 = roadController.getMap()[1][0];
			expect(car3).to.be.an("object");
			expect(car3.speed).to.be.equal(3);
			expect(car3.position).to.be.equal(0);
			carbroken = roadController.getMap()[0][7];
			expect(carbroken).to.be.an("object");
			expect(carbroken.speed).to.be.equal(0);
			expect(carbroken.status).to.be.equal("x");
			expect(carbroken.position).to.be.equal(7);

			if(debug) console.info("t=1");
			car1 = car2 = car3 = carbroken = null;
			roadController.goFunction();

			if(debug) console.info("t=2");
			car1 = car2 = car3 = carbroken = null;
			roadController.goFunction();
			nothing = roadController.getMap()[1][6];
			expect(nothing).to.be.null;
			car3 = roadController.getMap()[1][2];
			expect(car3.speed).to.be.equal(3);
			expect(car3.position).to.be.equal(2);
			car1 = roadController.getMap()[0][6];
			expect(car1).to.be.an("object");
			expect(car1.speed).to.be.equal(0);
			expect(car1.position).to.be.equal(6);

			if(debug) console.info("t=3");
			car1 = car2 = car3 = carbroken = null;
			roadController.goFunction();
			nothing = roadController.getMap()[0][6];
			expect(nothing).to.be.null;
			car1 = roadController.getMap()[1][6];
			expect(car1).to.be.an("object");
			expect(car1.speed).to.be.equal(0);
			expect(car1.position).to.be.equal(6);

			if(debug) console.info("t=4");
			car1 = car2 = car3 = carbroken = null;
			roadController.goFunction();
			car1 = roadController.getMap()[1][6];
			expect(car1).to.be.an("object");
			expect(car1.speed).to.be.equal(1);
			expect(car1.position).to.be.equal(6);
			car3 = roadController.getMap()[1][4];
			expect(car3).to.be.an("object");
			expect(car3.speed).to.be.equal(2);
			expect(car3.position).to.be.equal(4);

			if(debug) console.info("t=5");
			car1 = car2 = car3 = carbroken = null;
			roadController.goFunction();
			car3 = roadController.getMap()[1][4];
			expect(car3).to.be.an("object");
			expect(car3.speed).to.be.equal(1);
			expect(car3.getI()).to.be.equal(4);

			if(debug) console.info("t=6");
			car1 = car2 = car3 = carbroken = null;
			roadController.goFunction();
			carbroken = roadController.getMap()[0][7];
			expect(carbroken).to.be.an("object");
			expect(carbroken.speed).to.be.equal(0);
			expect(carbroken.status).to.be.equal("x");
			expect(carbroken.position).to.be.equal(7);
			car3 = roadController.getMap()[1][5];
			expect(car3).to.be.an("object");
			expect(car3.speed).to.be.equal(0);
			expect(car3.getI()).to.be.equal(5);

		});

	});

});