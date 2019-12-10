import View from "/View.js";
import Map from "./Classes/Map.js";
import Player from "./Classes/Player.js";

View.init();
console.log("Start");

let imagesLoaded = false;

Math.seed = 'will';
window.Global = {
	chunkCount: 0,
	zoomLevel: 1.15,
	tileSize: 20,
	chunkSize: 15,
	currentChunk: [0, 0],
	playerPosition: [0,7,7],
	playerDirection: 'n',
};

var tileSets = View.loadImages();

let map = Map.init();

let mapCanvas = View.createCanvas("dungeonMap");
let mapCtx = View.createContext(mapCanvas);

//window load
window.addEventListener('load', view);
function view() {
	imagesLoaded = true;
	View.renderDungeon(tileSets, map, mapCtx, mapCanvas);
	Player.playerMovement(tileSets, map, mapCtx);
}
