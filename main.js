import View from "/View.js";
import Map from "./Classes/Map.js";

let chunkSize = 15;
Math.seed = 'will';



var tileSets = View.loadImages();

let level = Map.init(chunkSize);

let canvas = View.createCanvas();
let ctx = View.createContext(canvas);


window.addEventListener('load', view);
function view() {
	View.renderDungeon(tileSets, level, ctx, canvas);
}
