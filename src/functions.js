export const init = () => {
    Math.seedRandom = function (max, min) {
        if (Global.seed === undefined /* | typeof Global.seed === 'string' */) {
            Global.seed = Math.floor(Math.random() * 1000);
        }

        if (typeof Global.seed === "string") {
            let seed = 1;
            for (let c in Global.seed) {
                seed = seed * Global.seed.charCodeAt(c);
            }
            Global.seed = seed;
        }
        max = max || 1;
        min = min || 0;
        Global.seed = (Global.seed * 9301 + 49297) % 233280;
        // console.log(Math.seed);
        // console.log(Math.seed);
        let rnd = Global.seed / 233280;
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
