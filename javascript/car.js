
var car = function(){

	this.blockHeight = 20;

	this.id = 0;
	this.max_speed = 0;
	this.speed = 0;
	this.avance = 0;
	this.status = "c"; // c = constant; b = breaking; a = acelerating; s = stopped

	this.position = 0;
	this.lane = 0;

	this.move = function(){
		this.position = this.position + this.avance;
		this.status = "c";
		return this;
	};
	this.getI = function(){
		return Math.floor(this.position);
	};
	this.getTopPostion = function(){
		return(this.position*this.blockHeight);
	};
	this.realSpeed = function(){
		return this.speed * 30;
	};

	this.slowDown = function() {
		if(this.status == "s") return;
		this.speed --;
		this.calculateAvance();
		if(this.speed == 0) this.status = "s"; else this.status = "b";
	};
	this.speedUp = function(){
		if( this.speed = this.max_speed ) return;
		this.speed ++;
		this.calculateAvance();
		this.status = "a";
	};
	this.hardBreak = function(){
		this.speed = 0;
		this.calculateAvance();
		this.status = "s"
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
			if(distance < breakingTime/2)
				this.hardBreak();
			else
				this.slowDown();
		}
	};

	this.print = function(){
		var prints = "<span class='car "+this.status+"' style='top: "+this.getTopPostion()+"px'>";
		switch(this.status){
			case "c": prints += "= "; break;
			case "b": prints += "< "; break;
			case "a": prints += "> "; break;
			case "s": prints += "x "; break;
		}
		prints = prints + this.realSpeed();
		prints = prints + "</span>";
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
}


