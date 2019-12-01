import View from "/View.js";
import Map from "./Classes/Map.js";

console.log("Start");

Math.seed = 'will';
window.Global = {
	chunkCount: 0,
	zoomLevel: 1,
	tileSize: 20,
	chunkSize: 15,
	currentChunk: [0, 0],
};

var tileSets = View.loadImages();

let map = Map.init();

let mapCanvas = View.createCanvas("dungeonMap");
let mapCtx = View.createContext(mapCanvas);

//window load
window.addEventListener('load', view);
function view() {
	View.renderDungeon(tileSets, map, mapCtx, mapCanvas);
}