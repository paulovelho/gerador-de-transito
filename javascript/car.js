
var car = function(){

	this.blockHeight = 20;

	this.id = 0;
	this.max_speed = 0;
	this.speed = 0;
	this.avance = 0;
	this.status = "c"; // c = constant; b = breaking; a = acelerating; s = stopped; x = broken

	this.position = 0;
	this.lane = 0;
	this.patience = 90;

	this.roundPosition = function(val){
		var parte_inteira = Math.floor(val);
		var parte_quebrada = val - parte_inteira;
		if( parte_quebrada >= 0.95 ){
			return (parte_inteira + 1);
		}
		if( parte_quebrada < 0.05 ){
			return parte_inteira;
		}
		return parseFloat(val);
	};

	this.move = function(){
		if(this.status == "s") return this;
		this.position = this.roundPosition(this.position + this.avance);
		if(this.status != "c")
			// this is just for set an accelerating time
			this.status = ( this.status == "n" ? "c" : "n" )
		this.patience ++;
		return this;
	};
	this.getI = function(){
		return Math.floor(this.position);
	};
	this.setPosition = function(i){
		this.position = i;
	};
	this.getTopPostion = function(){
		return(this.position*this.blockHeight);
	};
	this.realSpeed = function(){
		return this.speed * 30;
	};

	this.broken = function(){
		this.speed = 0;
		this.calculateAvance();
		this.status = "x";
	};

	this.slowDown = function() {
		if(this.speed == 0){ 
			this.status = "s";
			return;
		}
//		console.info("slowing down...");
		this.speed --;
		this.patience = this.patience - (5 + this.speed);
		this.calculateAvance();
		this.status = "b";
	};
	this.speedUp = function(){
		if( this.status == "x" ) return;
		if( this.status == "b" ){ 
			this.status = (this.speed == 0 ? "s" : "c");
			return; 
		}
		if( this.speed == this.max_speed ) return;
		this.speed ++;
		this.patience ++;
		this.calculateAvance();
		this.status = "a";
	};
	this.hardBreak = function(){
//		console.info("breaking...")
		if(this.speed == 0){ 
			this.patience = this.patience - 20;
			this.status = "s";
			return;
		}
		this.speed = 0;
		this.calculateAvance();
		this.patience = this.patience - 10;
		this.status = "b"
	}
	this.changeLane = function(){
		if( this.status == "x" ) return false;
		if( this.speed > 1 ) return false;
		this.lane++;
		this.hardBreak();
		return true;
	}

	this.calculateAvance = function(){
		switch(this.speed){
			case 0:
				this.avance = 0;
			break;
			case 1:
				this.avance = 0.33;
			break;
			case 2:
				this.avance = 0.66;
			break;
			case 3:
				this.avance = 1;
			break;
		}
	}

	this.frontCarAt = function(position){
		var breakingTime = this.speed;
		var distance = (position - this.position);
		if(distance < breakingTime){
			if(distance < breakingTime-1)
				this.hardBreak();
			else
				this.slowDown();
		}
	};

	this.print = function(){
		var prints = "<span class='car "+this.status+"' id='car"+this.id+"' style='top: "+this.getTopPostion()+"px'><p>";
		switch(this.status){
			case "c": case "n": prints += "= "; break;
			case "b": prints += "< "; break;
			case "a": prints += "> "; break;
			case "s": prints += "* "; break;
		}
		prints += this.realSpeed();
		prints += "</p>";
		if(this.status == "x") prints += "--";
		prints += "</span>";
		return prints;
	}

	this.start = function(id, max_speed, lane){
//		if(TheOddsAre(20) && newSpeed > 1) newSpeed--;
		this.id = id;
		this.lane = lane;
		this.max_speed = max_speed;
		this.speed = max_speed;
//		if(id == 2) this.speed --;
		this.calculateAvance();
		return this;
	};
};

car.prototype.toString = function(){
	return "[car "+this.id+" ="+this.status+"|"+this.speed+"]";
};


