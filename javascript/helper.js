// function to calculate chance for a car to be slower depending on his lane
function chanceToBeSlower(l){
	var lanes = 5;
	if(l > lanes) return 0;
	var chanceToBeSlower = 10; // default = 10% of chance of a slower vehicle;
	if(lanes > 1){
		var minimumChance = 20;
		var degree = 20 / (lanes-1);
		chanceToBeSlower = degree * (lanes-1-l);
	}
	return chanceToBeSlower;
}