import Tiles from "../Data/Tiles.js";

export default {
	createCanvas: function() {
		var gameCanvas = document.getElementById("game");
		
		gameCanvas.style.position = "absolute";
		gameCanvas.style.top = "0";
		gameCanvas.style.left = "0";
		gameCanvas.width = window.innerWidth;
		gameCanvas.height = window.innerHeight;
		return gameCanvas
	},
	createContext: function(gameCanvas) {
		return gameCanvas.getContext("2d");
	},
	loadImages: function(directory = null) {
		if (directory !== null) {
			//load files from directory (if php is enabled and a directory is passed)
		} else {
			let tileSets = {
				solidRoom: new Image(),
				openRoom: new Image(),
			};
			for (const key in tileSets) {
				if (tileSets.hasOwnProperty(key)) {
					const element = tileSets[key];
					// element.src = Tiles[key].img;
				}
			}
		}

	},
	renderDungeon: function(dungeon, ctx, canvas) {
		let dx,dy;
		dy = 0;
		dungeon.forEach((row, x) => {
			dx = 0;
			row.forEach((tile, y) => {
				console.log(tile.tileType.img);
				// ctx.fillStyle = tile.tileType.background;
				// ctx.fillRect(
				// 	dx,
				// 	dy,
				// 	tile.tileWidth,
				// 	tile.tileHeight
				// );
				// // ctx.strokeStyle = tile.tileType.background;
				// ctx.strokeRect(
				// 	dx,
				// 	dy,
				// 	tile.tileWidth,
				// 	tile.tileHeight
				// );
				console.log(dx,dy,tile.tileType.img.width)
				ctx.drawImage(tile.tileType.img, dx, dy, tile.tileWidth, tile.tileHeight);
				if(tile.tileType.border !== 'none') {
				}
				//or use tile images??
				//if door north/east/south/west true
					//draw path for stroke?
					//lineTo
					//moveTo
					// use width/height +(-) 2? in calculations to figure where lines start/end
				dx += tile.tileWidth;
			});
			// dy += row[x].tile[x];
			dy += dungeon[x][0].tileHeight;
			
		});
	},
};
