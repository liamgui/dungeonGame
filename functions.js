Math.seedRandom = function(max, min) {
	if (Math.seed === undefined /* | typeof Math.seed === 'string' */) {
		Math.seed = Math.floor(Math.random() * 1000);
	}
	
	if (typeof Math.seed === 'string') {
		let seed = 1; 
		for (let c in Math.seed){
			seed = seed * Math.seed.charCodeAt(c);
		};
		Math.seed = seed;
	}
	max = max || 1;
	min = min || 0;
	Math.seed = (Math.seed * 9301 + 49297) % 233280;
	// console.log(Math.seed);
	// console.log(Math.seed);
	var rnd = Math.seed / 233280;
	return min + rnd * (max - min);
};

var getIndexOfK = function (arr, k) {
	for (var i = 0; i < arr.length; i++) {
		var index = arr[i].indexOf(k);
		if (index > -1) {
			return [i, index];
		}
	}
}