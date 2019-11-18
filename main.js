import View from "/View.js";
import Map from "./Classes/Map.js";

let levelX = 30;
let levelY = 30;

// function loadTiles() {
	// var dir = "/tileSets";
	// var fileextension = ".png";
	// $.ajax({
	// 	//This will retrieve the contents of the folder if the folder is configured as 'browsable'
	// 	url: dir,
	// 	success: function(data) {
	// 		// List all png file names in the page
	// 		console.log();
	// 	}
	// });
	// return tiles;
// }

View.loadImages();

let level = Map.init(levelX, levelY);

let canvas = View.createCanvas();
let ctx = View.createContext(canvas);

// console.log(level[level.length-1][level[level.length-1].length - 1].tileType.img);
// level[level.length - 1][level[level.length - 1].length - 1].tileType.img.addEventListener("load", view);

function view() {
	View.renderDungeon(level, ctx, canvas);
}
// View.renderDungeon(level, ctx, canvas);
// console.log(level);

// for (i = 0; i < 100; i++) {

//     var x = Math.random() * window.innerWidth;
//     var y = Math.random() * window.innerHeight;
//     var builderUnit = new Unit(x, y);
//     builderUnit.draw();

// }

// if (unit.selected === true) {
// }
