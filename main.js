import View from "/View.js";
import Map from "./Classes/Map.js";
import Player from "./Classes/Player.js";
import Commands from "./Classes/Commands.js";

View.init();
console.log("Start");

let imagesLoaded = false;

Math.seed = "will";
window.Global = {
    chunkCount: 0,
    zoomLevel: 1.15,
    tileSize: 20,
    chunkSize: 15,
    currentChunk: [0, 0],
    playerPosition: [0, 7, 7],
    playerDirection: "n",
    revealAll: false,
    clipping: false,
    seed: "will"
};

var tileSets = View.loadImages();
let map;
if (window.localStorage.getItem("dungeonMap") !== null) {
    map = JSON.parse(window.localStorage.getItem("dungeonMap"));
    Global.currentChunk = JSON.parse(window.localStorage.getItem("currentChunk"));
    Global.playerPosition = JSON.parse(window.localStorage.getItem("playerPosition"));
    Global.playerDirection = JSON.parse(window.localStorage.getItem("playerDirection"));
    Global.seed = window.localStorage.getItem("mapSeed");
    console.log(map);
} else {
    map = Map.init();
}

let mapCanvas = View.createCanvas("dungeonMap");
let mapCtx = View.createContext(mapCanvas);

//window load
window.addEventListener("load", view);
function view() {
    imagesLoaded = true;
    View.renderDungeon(tileSets, map, mapCtx, mapCanvas);
    map = Player.playerMovement(tileSets, map, mapCtx);
    Commands.enableCheatCodes(tileSets, map, mapCtx );
}
