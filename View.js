import Tiles from "../Data/Tiles.js";

export default {
	createCanvas: function(canvasName) {
		var canvas = document.getElementById(canvasName);
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		// canvas.style.height = canvas.style.height * 2;
		return canvas
	},
	createContext: function(gameCanvas) {
		return gameCanvas.getContext("2d");
	},
	loadImages: function(directory = null) {
		let tileSets = {};
		if (directory !== null) {
			//load files from directory (if php is enabled and a directory is passed)
		} else {
			for (let tileName of Tiles.tileNames) {
				let tileImg = new Image();
				tileImg.src = 'tileSets/' + tileName + '.png';
				tileImg.width = tileImg.height = Global.tileSize;
				// tileImg.height = 20;

				tileSets[tileName] = tileImg;

			}
			for (const key in tileSets) {
				if (tileSets.hasOwnProperty(key)) {
					const element = tileSets[key];
					// element.src = Tiles[key].img;
				}
			}
		}
		return tileSets;
	},



	//View map section
	//add renderChunk to render each dungeons chunk by id
	//then when those are "rendered", renderDungeon to truly render chunks?
	renderDungeon: function(tileSets, dungeon, ctx, canvas) {
		let dx,dy;
		dy = 0;
		dungeon.chunkList[1].forEach((row, x) => {
			dx = 0;
			let tileHeight, tileWidth;
			row.forEach((tile, y) => {
				tileHeight = tile.tileHeight * Global.zoomLevel;
				tileWidth = tile.tileWidth * Global.zoomLevel;
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
				// console.log();
				ctx.drawImage(tileSets[tile.tileType], dx, dy, tileWidth, tileHeight);

				//or use tile images??
				//if door north/east/south/west true
					//draw path for stroke?
					//lineTo
					//moveTo
					// use width/height +(-) 2? in calculations to figure where lines start/end
				dx += tileWidth;
			});
			// dy += row[x].tile[x];
			dy += tileHeight;
			
		});
	},
};
