import Tiles from "../Data/Tiles.js";

export default {
	createCanvas: function(canvasName) {
		var canvas = document.getElementById(canvasName);
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// canvas.style.height = canvas.style.height * 2;
		return canvas;
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
				tileImg.src = "tileSets/" + tileName + ".png";
				tileImg.width = tileImg.height = Global.tileSize;
				// tileImg.height = 20;

				tileSets[tileName] = tileImg;
			}
			// ? Not sure what I was trying to do here?
			// for (const key in tileSets) {
			// 	if (tileSets.hasOwnProperty(key)) {
			// 		const element = tileSets[key];
			// 		// element.src = Tiles[key].img;
			// 	}
			// }
		}
		return tileSets;
	},

	//View map section
	//add renderChunk to render each dungeons chunk by id
	//then when those are "rendered", renderDungeon to truly render chunks?
	renderDungeon: function(tileSets, map, ctx) {
		ctx.fillStyle = "#444";
		ctx.fillRect(0, 0, ctx.canvas.parentElement.clientWidth, ctx.canvas.parentElement.clientHeight);
		let parentWidth = ctx.canvas.parentElement.clientWidth;
		let parentHeight = ctx.canvas.parentElement.clientHeight;

		let centerWidth = parentWidth / 2 - Global.chunkSize * (Global.tileSize / 2) * Global.zoomLevel;
		let centerHeight = parentHeight / 2 - Global.chunkSize * (Global.tileSize / 2) * Global.zoomLevel;

		let chunkStartX = parentWidth / 2;
		let chunkStartY = parentWidth / 2;

		//check player's position and adjust chunk accordingly (place where the chunk should be rendered from);
		chunkStartX -= Global.playerPosition[1] * Global.tileSize + Global.tileSize / 2;
		chunkStartY -= Global.playerPosition[2] * Global.tileSize + Global.tileSize / 2;

		//render first chunk
		renderChunk(map.chunkList[map.chunkGrid[Global.currentChunk[0]][Global.currentChunk[1]]]);

		//perform calculation based on size of div (resizable) to see how many chunks need to be rendered.
		//MAKE SURE TO USE ZOOM SIZE
		//something like this should work..
		//numberOfChunk is how many chunks should be rendered
		let numberOfChunkX, numberOfChunkY;
		numberOfChunkX = Math.ceil(parentWidth / (Global.chunkSize * Global.tileSize));
		numberOfChunkY = Math.ceil(parentHeight / (Global.chunkSize * Global.tileSize));

		//// Object.keys(map.chunkList).forEach(chunkId => {
		//// 	renderChunk(map.chunkList[chunkId]);
		//// });

		function renderChunk(chunk) {
			let dy, dx;
			dy = chunkStartY;
			chunk.forEach((row, x) => {
				dx = chunkStartX;
				let tileHeight, tileWidth;
				row.forEach((tile, y) => {
					tileHeight = tile.tileHeight * Global.zoomLevel;
					tileWidth = tile.tileWidth * Global.zoomLevel;

					ctx.drawImage(tileSets[tile.tileType], dx, dy, tileWidth, tileHeight);

					dx += tileWidth;
				});

				dy += tileHeight;
			});
		}
	},
	renderPlayer: function(playerPosition) {}
};
