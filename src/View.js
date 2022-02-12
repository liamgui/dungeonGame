import Tiles from "./Data/Tiles.json";
import Map from "./Classes/Map.js";
import * as functions from "./functions.js";

export default {
	init() {
		document.body.style.height = window.innerHeight + 'px';
		document.body.style.width = window.innerWidth + 'px';
	},

	createCanvas(canvasName) {
		let canvas = document.getElementById(canvasName);
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// canvas.style.height = canvas.style.height * 2;
		return canvas;
	},
	createContext(gameCanvas) {
		return gameCanvas.getContext("2d");
	},
	loadImages(directory = null) {
		let tileSets = {};
		if (directory !== null) {
			//load files from directory (if php is enabled and a directory is passed)
		} else {
			for (let tileName of Tiles.tileNames) {
				let tileImg = new Image();
				tileImg.src = "assets/tileSets/" + tileName + ".png";
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
	renderDungeon(tileSets, map, ctx) {
		ctx.fillStyle = "#444";
		ctx.fillRect(0, 0, ctx.canvas.parentElement.clientWidth, ctx.canvas.parentElement.clientHeight);

		let tileSize = Global.tileSize;
		let zoomLevel = Global.zoomLevel;
		let chunkSize = Global.chunkSize;
		let playerPos_1 = Global.playerPosition[1];
		let playerPos_2 = Global.playerPosition[2];
		let currentChunkId = Global.playerPosition[0];

		let parentWidth = ctx.canvas.parentElement.clientWidth;
		let parentHeight = ctx.canvas.parentElement.clientHeight;

		let centerWidth = parentWidth / 2 - chunkSize * (tileSize / 2) * zoomLevel;
		let centerHeight = parentHeight / 2 - chunkSize * (tileSize / 2) * zoomLevel;

		let originChunkStartX = parentWidth / 2 - (Global.playerPosition[2] * tileSize + tileSize / 2) * zoomLevel;
		let originChunkStartY = parentHeight / 2 - (Global.playerPosition[1] * tileSize + tileSize / 2) * zoomLevel;

		//check player's position and adjust chunk accordingly (place where the chunk should be rendered from);
		let chunkStartX = originChunkStartX;
		let chunkStartY = originChunkStartY;

		//render first chunk
		renderChunk(map.chunkGrid[Global.currentChunk[0]][Global.currentChunk[1]]);

		//perform calculation based on size of div (resizable) to see how many chunks need to be rendered.
		//MAKE SURE TO USE ZOOM SIZE
		//something like this should work..
		//numberOfChunk is how many chunks should be rendered
        let numberOfChunks = {
            x:0,
            y:0
        };
		
		numberOfChunks.x = Math.ceil(parentWidth / ((chunkSize * tileSize) * zoomLevel)) - 1;
		numberOfChunks.y = Math.ceil(parentHeight / ((chunkSize * tileSize) * zoomLevel)) - 1;
		
		//north chunks
        renderNorthernChunks({
            numberOfChunks,
            chunkSize,
            tileSize,
            zoomLevel,
            map
        });

		//south chunks
        renderSouthernChunks({
            numberOfChunks,
            chunkSize,
            tileSize,
            zoomLevel,
            map
        });

		//east chunks
        renderEastChunks({
            numberOfChunksX: numberOfChunks.x,
            chunkSize,
            tileSize,
            zoomLevel,
            map
        });

        
		//west chunks
        renderWestChunks({
            numberOfChunksX: numberOfChunks.x,
            chunkSize,
            tileSize,
            zoomLevel,
            map
        });


        //render player
		this.renderPlayer(ctx);
		//// Object.keys(map.chunkList).forEach(chunkId => {
		//// 	renderChunk(map.chunkList[chunkId]);
		//// });

        function renderNorthernChunks({numberOfChunks, chunkSize, tileSize, zoomLevel, map}) {
            for(let y = 1; y <= numberOfChunks.y; y++) {
                chunkStartY -= chunkSize * tileSize * zoomLevel;
                renderChunk(map.chunkGrid[Global.currentChunk[0] + (-y)][Global.currentChunk[1]])
                
                //east chunks
                renderEastChunks({numberOfChunksX: numberOfChunks.x, chunkSize, tileSize, zoomLevel, map, y: (-y)});
                //west chunks
                renderWestChunks({numberOfChunksX: numberOfChunks.x, chunkSize, tileSize, zoomLevel, map, y: (-y)});                
            }
            chunkStartY = originChunkStartY;
        }
        function renderSouthernChunks({numberOfChunks, chunkSize, tileSize, zoomLevel, map}) {
            for(let y = 1; y <= numberOfChunks.y; y++) {
                chunkStartY += chunkSize * tileSize * zoomLevel;
                renderChunk(map.chunkGrid[Global.currentChunk[0] + y][Global.currentChunk[1]]);
                
                //east chunks of this row
                renderEastChunks({numberOfChunksX: numberOfChunks.x, chunkStartX, chunkSize, tileSize, zoomLevel, map, y});
                //west chunks of this row
                renderWestChunks({numberOfChunksX: numberOfChunks.x, chunkStartX, chunkSize, tileSize, zoomLevel, map, y});                
            }
            chunkStartY = originChunkStartY;
        }

        function renderEastChunks({numberOfChunksX, chunkSize, tileSize, zoomLevel, map, y = 0}) {
            for(let x = 1; x <= numberOfChunksX; x++) {
                chunkStartX += chunkSize * tileSize * zoomLevel;
                renderChunk(map.chunkGrid[Global.currentChunk[0] + y][Global.currentChunk[1] + x]);
            }
            //perform a reset?
            chunkStartX = originChunkStartX;
        }
        
        function renderWestChunks({numberOfChunksX, chunkSize, tileSize, zoomLevel, map, y = 0}) {
            for(let x = 1; x <= numberOfChunksX; x++) {
                chunkStartX -= chunkSize * tileSize * zoomLevel;
                renderChunk(map.chunkGrid[Global.currentChunk[0] + y][Global.currentChunk[1] - x]);
            }
                    //perform a reset?
            chunkStartX = originChunkStartX;
        }

		function renderChunk(chunkId) {
			if (chunkId == undefined) {
				return;
			} else if (chunkId != undefined || Map.checkForChunk(functions.getIndexOfK(map.chunkGrid, chunkId), map)) {
				let chunk = map.chunkList[chunkId]
				let dy, dx;
				dy = chunkStartY;
				chunk.forEach((row, x) => {
					dx = chunkStartX;
					let tileHeight, tileWidth;
					row.forEach((tile, y) => {
						tileHeight = (tile.tileHeight) * Global.zoomLevel;
						tileWidth = tile.tileWidth * Global.zoomLevel;
						if (tile.explored || Global.revealAll) {
							ctx.fillStyle = "#181818";
							ctx.fillRect(dx, dy, tileWidth - 0.15, tileHeight - 0.15);
							ctx.drawImage(tileSets[tile.tileType], dx - 0.5, dy - 0.5, tileWidth, tileHeight );
						} else if (tile.discovered) {
							ctx.fillStyle = "#383838";
							ctx.fillRect(dx, dy, tileWidth - 0.15, tile.height - 0.15);
							ctx.drawImage(tileSets[tile.tileType], dx - 0.5, dy - 0.5, tileWidth, tileHeight );
						}
							dx += tileWidth;
					});

					dy += tileHeight;
				});
			} else {
				return;
			}
		}
	},
	renderPlayer(ctx) {
		let parentWidth = ctx.canvas.parentElement.clientWidth;
		let parentHeight = ctx.canvas.parentElement.clientHeight;
		let centerWidth = parentHeight/2;
		let centerHeight = parentHeight/2;
		let rotation = 0;
		// add zoom feature
		
		// ctx.fillStyle = "rgba(210,210,230,0.05)";
		// ctx.fillRect((centerWidth) * Global.zoomLevel - (tileSize / 2), (centerHeight) * Global.zoomLevel - (Global.tileSize / 2), 20 * Global.zoomLevel, 20 * Global.zoomLevel);
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
