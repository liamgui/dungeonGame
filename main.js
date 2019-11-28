import View from "/View.js";
import Map from "./Classes/Map.js";

let chunkSize = 15;
Math.seed = 'will';



var tileSets = View.loadImages();

let level = Map.init(chunkSize);

let map = View.createCanvas("dungeonMap");
let mapCtx = View.createContext(map);

//window load
window.addEventListener('load', view);
function view() {
	View.renderDungeon(tileSets, level, mapCtx, map);
}
