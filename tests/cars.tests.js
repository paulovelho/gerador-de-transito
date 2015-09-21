describe("Cars", function(){

	it("os testes tem que funcionar", function(){
		expect(true).to.be.true;
		console.info(car);
	});

	describe("HaddadFdp", function(){
		it("car nao pode correr mais que sua propria velocidade maxima", function(){
			var c = new car();
			c.start(1, 2, 0);
			c.speedUp();
			c.speedUp();
			c.speedUp();
			expect(c.speed).to.be.equal(2);
		});
		it("car nao pode ter velocidade negativa", function(){
			var c = new car();
			c.start(1, 2, 0);
			c.slowDown();
			c.slowDown();
			c.slowDown();
			expect(c.speed).to.be.equal(0);
		});
		it("car hardBreak funciona", function(){
			var c = new car();
			c.start(1, 3, 0);
			c.hardBreak();
			expect(c.speed).to.be.equal(0);
			expect(c.status).to.be.equal("s");
		});
	});

});