describe("Cars", function(){

	it("os testes tem que funcionar", function(){
		expect(true).to.be.true;
	});

	describe("HaddadFdp", function(){
		it("arredonda essa posicao ai senao fica foda fazer as contas, cara", function(){
			// quando posicao > .95 arredonda o numero pra cima...
			var c = new car();
			expect(c.roundPosition("0.96")).to.be.equal(1);
			expect(c.roundPosition("3.98")).to.be.equal(4);
			expect(c.roundPosition("2.95")).to.be.equal(3);
			expect(c.roundPosition("7.92")).to.be.equal(7.92);
			expect(c.roundPosition("2.03")).to.be.equal(2);
			expect(c.roundPosition("9.04")).to.be.equal(9);
		});

		it("posicao do carro arredonda tambem", function(){
			var c = new car();
			c.start(1, 1, 0);
			c.move();
			expect(c.position).to.be.equal(0.33);
			c.move();
			expect(c.position).to.be.equal(0.66);
			c.move();
			expect(c.position).to.be.equal(1);
		});

		it("changing lanes", function(){
			var c = new car();
			c.start(1, 3, 1);
			// car can't change lane if too fast
			c.changeLane();
			expect(c.lane).to.be.equal(1);
			c.slowDown();
			c.slowDown();
			c.changeLane();
			expect(c.lane).to.be.equal(2);
			expect(c.speed).to.be.equal(0);
		})

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
			expect(c.status).to.be.equal("b");
		});

		it("car nao pode acelerar se estiver freando", function(){
			var c = new car();
			c.start(1, 2, 0);
			c.slowDown();
			expect(c.speed).to.be.equal(1);
			expect(c.status).to.be.equal("b");
			c.speedUp();
		});

		it("o carro quebrou. liga pra porto", function(){
			var c = new car();
			c.start(1, 3, 0);
			c.broken();
			expect(c.position).to.be.equal(0);
			expect(c.speed).to.be.equal(0);
			expect(c.status).to.be.equal("x");
			c.speedUp();
			expect(c.speed).to.be.equal(0);
			expect(c.status).to.be.equal("x");
			c.move();
			expect(c.position).to.be.equal(0);
		});
	});

});