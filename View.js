import Tiles from "../Data/Tiles.js";
import Map from "./Classes/Map.js"

export default {
	init: function() {
		document.body.style.height = window.innerHeight + 'px';
		document.body.style.width = window.innerWidth + 'px';
	},
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
		let chunkStartY = parentHeight / 2;

		//check player's position and adjust chunk accordingly (place where the chunk should be rendered from);
		chunkStartX -= Global.playerPosition[2] * Global.tileSize + Global.tileSize / 2;
		chunkStartY -= Global.playerPosition[1] * Global.tileSize + Global.tileSize / 2;

		//render first chunk
		renderChunk(map.chunkGrid[Global.currentChunk[0]][Global.currentChunk[1]]);

		//perform calculation based on size of div (resizable) to see how many chunks need to be rendered.
		//MAKE SURE TO USE ZOOM SIZE
		//something like this should work..
		//numberOfChunk is how many chunks should be rendered
		let numberOfChunkX, numberOfChunkY;
		numberOfChunkX = Math.ceil(parentWidth / (Global.chunkSize * Global.tileSize)) - 1;
		numberOfChunkY = Math.ceil(parentHeight / (Global.chunkSize * Global.tileSize)) - 1;
		
		//north chunks
		for(let y = 1; y <= numberOfChunkY; y++) {
			chunkStartY -= Global.chunkSize * Global.tileSize;
			renderChunk(map.chunkGrid[Global.currentChunk[0] - y][Global.currentChunk[1]])
			
			//east chunks
			for(let x = 1; x <= numberOfChunkX; x++) {
				chunkStartX += Global.chunkSize * Global.tileSize;
				renderChunk(map.chunkGrid[Global.currentChunk[0] - y][Global.currentChunk[1] + x])
			}
			
			chunkStartX = parentWidth / 2;
			chunkStartX -= Global.playerPosition[2] * Global.tileSize + Global.tileSize / 2;
			
			//west chunks
			for(let x = 1; x <= numberOfChunkX; x++) {
				chunkStartX -= Global.chunkSize * Global.tileSize;
				renderChunk(map.chunkGrid[Global.currentChunk[0] - y][Global.currentChunk[1] - x])
			}
			
			chunkStartX = parentWidth / 2;
			chunkStartX -= Global.playerPosition[2] * Global.tileSize + Global.tileSize / 2;
		}
		
		chunkStartY = parentWidth / 2;
		chunkStartY -= Global.playerPosition[1] * Global.tileSize + Global.tileSize / 2;
		
		//south chunks
		for(let y = 1; y <= numberOfChunkY; y++) {
			chunkStartY += Global.chunkSize * Global.tileSize;
			renderChunk(map.chunkGrid[Global.currentChunk[0] + y][Global.currentChunk[1]]);
			
			//east chunks
			for(let x = 1; x <= numberOfChunkX; x++) {
				chunkStartX += Global.chunkSize * Global.tileSize;
				renderChunk(
					map.chunkGrid[Global.currentChunk[0] + y][Global.currentChunk[1] + x]);
			}
			
			chunkStartX = parentWidth / 2;
			chunkStartX -= Global.playerPosition[2] * Global.tileSize + Global.tileSize / 2;
			
			//west chunks
			for(let x = 1; x <= numberOfChunkX; x++) {
				chunkStartX -= Global.chunkSize * Global.tileSize;
				renderChunk(
					map.chunkGrid[Global.currentChunk[0] + y][Global.currentChunk[1] - x]);
			}
			
			chunkStartX = parentWidth / 2;
			chunkStartX -= Global.playerPosition[2] * Global.tileSize + Global.tileSize / 2;
		}
		
		chunkStartY = parentWidth / 2;
		chunkStartY -= Global.playerPosition[1] * Global.tileSize + Global.tileSize / 2;

		//east chunks
		for(let x = 1; x <= numberOfChunkX; x++) {
			chunkStartX += Global.chunkSize * Global.tileSize;
			renderChunk(
				map.chunkGrid[Global.currentChunk[0]][Global.currentChunk[1] + x]);
		}

		chunkStartX = parentWidth / 2;
		chunkStartX -= Global.playerPosition[2] * Global.tileSize + Global.tileSize / 2;

		//west chunks
		for(let x = 1; x <= numberOfChunkX; x++) {
			chunkStartX -= Global.chunkSize * Global.tileSize;
			renderChunk(
				map.chunkGrid[Global.currentChunk[0]][Global.currentChunk[1] - x]);
		}
		
		chunkStartX = parentWidth / 2;
		chunkStartX -= Global.playerPosition[2] * Global.tileSize + Global.tileSize / 2;
		this.renderPlayer(ctx);
		//// Object.keys(map.chunkList).forEach(chunkId => {
		//// 	renderChunk(map.chunkList[chunkId]);
		//// });

		function renderChunk(chunkId) {
			if (chunkId == undefined) {
				return;
			} else if (chunkId != undefined || Map.checkForChunk(getIndexOfK(map.chunkGrid, chunkId), map)) {
				let chunk = map.chunkList[chunkId]
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
			} else {
				return;
			}
		}
	},
	renderPlayer: function(ctx) {
		let parentWidth = ctx.canvas.parentElement.clientWidth;
		let parentHeight = ctx.canvas.parentElement.clientHeight;
		let centerWidth = parentHeight/2;
		let centerHeight = parentHeight/2;
		let rotation = 0;
		// add zoom feature
		
		// ctx.fillStyle = "rgba(210,210,230,0.05)";
		// ctx.fillRect((centerWidth) * Global.zoomLevel - (Global.tileSize / 2), (centerHeight) * Global.zoomLevel - (Global.tileSize / 2), 20 * Global.zoomLevel, 20 * Global.zoomLevel);
		// ctx.strokeStyle = "rgba(200,200,200,1)";
		// ctx.lineWidth = 0.1;
		// ctx.strokeRect(
		// 	centerWidth * Global.zoomLevel - Global.tileSize / 2,
		// 	centerHeight * Global.zoomLevel - Global.tileSize / 2,
		// 	20 * Global.zoomLevel,
		// 	20 * Global.zoomLevel
		// );

		ctx.beginPath();
		
		ctx.translate(centerWidth, centerHeight);
		if (Global.playerDirection === 'n') {
			rotation = 0;
		} else if (Global.playerDirection === 'e') {
			rotation = 90;
		} else if (Global.playerDirection === 's') {
			rotation = 180;
		} else if (Global.playerDirection === 'w') {
			rotation = 270;
		}
		ctx.rotate(rotation * Math.PI/180);
		ctx.translate(-centerWidth, -centerHeight)

		ctx.lineTo(centerWidth, centerHeight - 2.5);
		ctx.lineTo(centerWidth + 4, centerHeight + 2);
		ctx.lineTo(centerWidth + 3, centerHeight + 2);
		ctx.lineTo(centerWidth, centerHeight - 2);
		ctx.lineTo(centerWidth - 3, centerHeight + 2);
		ctx.lineTo(centerWidth - 4, centerHeight + 2);
		ctx.lineTo(centerWidth, centerHeight - 2.5);
		// ctx.arc(centerWidth, centerHeight + 1, 2.5, 0, Math.PI, false);
		ctx.strokeStyle = "rgba(200,200,200, 1)";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.fillStyle = "rgba(200,200,200, 1)";
		ctx.fill();
		ctx.closePath();

		ctx.resetTransform();
	}
}
