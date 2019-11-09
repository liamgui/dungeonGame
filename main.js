import View from "/View.js";
import Map from "./Classes/Map.js";

let levelX = 30;
let levelY = 30;

let level = Map.init(levelX, levelY);

let canvas = View.createCanvas();
let ctx = View.createContext(canvas);
View.renderDungeon(level, ctx, canvas);
// console.log(level);

// for (i = 0; i < 100; i++) {

//     var x = Math.random() * window.innerWidth;
//     var y = Math.random() * window.innerHeight;
//     var builderUnit = new Unit(x, y);
//     builderUnit.draw();

// }

// if (unit.selected === true) {
// }
