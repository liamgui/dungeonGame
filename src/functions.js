export const init = () => {
    Math.seedRandom = ({
		max = 1,
		min = 0,
		seed = null
	}) => {
		if (seed) {
			if (window.Global.seed) {
				seed = window.Global.seed;
			} else if (window.localStorage.getItem('seed')) {
				seed = window.localStorage.getItem('seed');
			} else {
				seed =Math.floor(Math.random() * 1000)
			}
		}
        if (typeof seed === "string") {
			seed = seedStringToNum(seed);
        }
        seed = (seed * 9301 + 49297) % 233280;
        let rnd = seed / 233280;
        return min + rnd * (max - min);
    };
};
export const getIndexOfK = function (arr, k) {
    for (let i = 0; i < arr.length; i++) {
        let index = arr[i].indexOf(k);
        if (index > -1) {
            return [i, index];
        }
    }
};

function seedStringToNum(seed) {
	let seedNum = 1;
	for (let c in seed) {
		seedNum = seedNum * seed.charCodeAt(c);
	}
	return seedNum; 
}

