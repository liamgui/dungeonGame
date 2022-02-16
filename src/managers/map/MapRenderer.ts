import { Manager } from "~/managers/base/Manager";
import { GameManager } from '~/managers/GameManager';
import Tiles from "~/Data/Tiles.json";
import * as functions from "~/functions.js";

export class MapRenderer extends Manager {
	private _ctx: CanvasRenderingContext2D;
	private _canvas: HTMLCanvasElement;
	private _tilesets: {};
	private _zoomLevel: number = 1.15;

    constructor(private GameManager: GameManager) {
        super();
        this.init();
		this._canvas = this.createCanvas("dungeonMap");
		this._ctx = this.createContext(this._canvas);
        // console.log(GameManger);
    }
	init() {
		document.body.style.height = window.innerHeight + 'px';
		document.body.style.width = window.innerWidth + 'px';
	}

	createCanvas(canvasName: String) {
		let canvas: HTMLCanvasElement = document.querySelector('[data-canvas="' + canvasName + '"]');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// canvas.style.height = canvas.style.height * 2;
		return canvas;
	}
	createContext(gameCanvas) {
		return gameCanvas.getContext("2d");
	}
	loadImages(directory = null) {
		let tilesets = {};
		if (directory !== null) {
			//load files from directory (if php is enabled and a directory is passed)
		} else {
			for (let tileName of Tiles.tileNames) {
				let tileImg = new Image();
				tileImg.src = "assets/tilesets/" + tileName + ".png";
				tileImg.width = tileImg.height = this.GameManager.MapManager.tileSize;
				// tileImg.height = 20;

				tilesets[tileName] = tileImg;
			}
			// ? Not sure what I was trying to do here?
			// for (const key in tilesets) {
			// 	if (tilesets.hasOwnProperty(key)) {
			// 		const element = tilesets[key];
			// 		// element.src = Tiles[key].img;
			// 	}
			// }
		}
		this._tilesets = tilesets;
		console.log(this.GameManager.MapManager.map);

		return tilesets;
	}

	//View map section
	//add renderChunk to render each dungeons chunk by id
	//then when those are "rendered", renderDungeon to truly render chunks?
	renderDungeon() {
		let map = this.GameManager.MapManager.map;
		this.ctx.fillStyle = "#444";
		this.ctx.fillRect(0, 0, this.ctx.canvas.parentElement.clientWidth, this.ctx.canvas.parentElement.clientHeight);


		let currentChunk = this.GameManager.MapManager.currentChunk;
		let tileSize = this.GameManager.MapManager.tileSize;
		let chunkSize = this.GameManager.MapManager.chunkSize;
		let playerPos_1 = this.GameManager.MapManager.playerPosition[1];
		let playerPos_2 = this.GameManager.MapManager.playerPosition[2];
		let currentChunkId = this.GameManager.MapManager.playerPosition[0];

		let parentWidth = this.ctx.canvas.parentElement.clientWidth;
		let parentHeight = this.ctx.canvas.parentElement.clientHeight;

		let centerWidth = parentWidth / 2 - chunkSize * (tileSize / 2) * this._zoomLevel;
		let centerHeight = parentHeight / 2 - chunkSize * (tileSize / 2) * this._zoomLevel;

		let originChunkStartX = parentWidth / 2 - (this.GameManager.MapManager.playerPosition[2] * tileSize + tileSize / 2) * this._zoomLevel;
		let originChunkStartY = parentHeight / 2 - (this.GameManager.MapManager.playerPosition[1] * tileSize + tileSize / 2) * this._zoomLevel;

		//check player's position and adjust chunk accordingly (place where the chunk should be rendered from);
		let chunkStart = {
			x: originChunkStartX,
			y: originChunkStartY
		}

		let numberOfChunks = {
            x: Math.ceil(parentWidth / ((chunkSize * tileSize) * this._zoomLevel)) - 1,
            y: Math.ceil(parentHeight / ((chunkSize * tileSize) * this._zoomLevel)) - 1
        };

		// numberOfChunks.x = Math.ceil(parentWidth / ((chunkSize * tileSize) * this._zoomLevel)) - 1;
		// numberOfChunks.y = Math.ceil(parentHeight / ((chunkSize * tileSize) * this._zoomLevel)) - 1;


		let chunkDirectionalMeta = {
			n: {
				renderAdditonalChunks: true,
				chunkStart: {
					x: originChunkStartX,
					y: originChunkStartY
				},
				multiplier: -1
			},
			s: {
				renderAdditonalChunks: true,
				multiplier: 1
			},
			e: {
			},
			w: {
			}
		}

		//render first chunk row
		this.renderChunkRow({chunkId: currentChunkId, chunkStart, numberOfChunks})

		let newChunkStart = {...chunkStart}
		// to the north
		let direction = -1;
		for (let y = 1; y <= numberOfChunks.y; y++) {
			let newChunkId = map.chunkGrid[currentChunk[0] + (direction * y)][currentChunk[1]];
			newChunkStart.y = chunkStart.y + (direction * chunkSize * tileSize * this._zoomLevel);
			this.renderChunkRow({chunkId: newChunkId, chunkStart: newChunkStart, numberOfChunks, y})
			//reset chunkStart.x
			newChunkStart.x = chunkStart.x;
		}
		direction = 1;
		newChunkStart = {...chunkStart};
		for (let y = 1; y <= numberOfChunks.y; y++) {
			let newChunkId = map.chunkGrid[currentChunk[0] + (direction * y)][currentChunk[1]];
			newChunkStart.y = chunkStart.y + (direction * chunkSize * tileSize * this._zoomLevel);
			this.renderChunkRow({chunkId: currentChunkId, chunkStart: newChunkStart, numberOfChunks, y})
			newChunkStart.x = chunkStart.x;
		}
		// to the south


        //render player
		this.renderPlayer();
		//// Object.keys(map.chunkList).forEach(chunkId => {
		//// 	renderChunk(map.chunkList[chunkId]);
		//// });

	}

	renderChunkRow({chunkId, chunkStart, numberOfChunks, y = 0}) {
		let map = this.GameManager.MapManager.map;
		let currentChunk = this.GameManager.MapManager.currentChunk;
		this.renderChunk({chunkId: chunkId, chunkStart: chunkStart});
		let newChunkStart = {...chunkStart};

		//go east
		let direction = 1;
		for (let x = 1; x <= numberOfChunks.x; x++) {
			//calculate new chunkStart
			newChunkStart.x = newChunkStart.x + (direction * (this.GameManager.MapManager.chunkSize * this.GameManager.MapManager.tileSize * this._zoomLevel));
			//calculate new chunkId
			let newChunkId = map.chunkGrid[currentChunk[0] + y][currentChunk[1] + (direction * x)];
			//renderChunk with new chunkId and new chunkStart
			this.renderChunk({chunkId: newChunkId, chunkStart: newChunkStart});
		}
		//go west young man
		direction = -1;
		newChunkStart = {...chunkStart};
		for (let x = 1; x <= numberOfChunks.x; x++) {
			//calculate new chunkStart
			newChunkStart.x = newChunkStart.x + (direction * (this.GameManager.MapManager.chunkSize * this.GameManager.MapManager.tileSize * this._zoomLevel));
			//calculate new chunkId
			let newChunkId = map.chunkGrid[currentChunk[0] + y][currentChunk[1] + (direction * x)];
			//renderChunk with new chunkId and new chunkStart
			this.renderChunk({chunkId: newChunkId, chunkStart: newChunkStart});
		}

	}
	renderChunk({chunkId, chunkStart}) {
		let map = this.GameManager.MapManager.map;
		if (chunkId || this.GameManager.MapManager.checkForChunk(functions.getIndexOfK(map.chunkGrid, chunkId))) {
			let chunk = map.chunkList[chunkId]
			let dy, dx;
			dy = chunkStart.y;
			for (let x in chunk) {
				let row = chunk[x];
				dx = chunkStart.x;
				let tileHeight, tileWidth;
				for (let y in row) {
					let tile = row[y];
					tileHeight = (tile.tileHeight) * this._zoomLevel;
					tileWidth = tile.tileWidth * this._zoomLevel;
					if (tile.explored || window.Global.revealAll) {
						this._ctx.fillStyle = "#181818";
						this._ctx.fillRect(dx, dy, tileWidth - 0.15, tileHeight - 0.15);
						this._ctx.drawImage(this.tilesets[tile.tileType], dx - 0.5, dy - 0.5, tileWidth, tileHeight );
					} else if (tile.discovered) {
						this._ctx.fillStyle = "#383838";
						this._ctx.fillRect(dx, dy, tileWidth - 0.15, tile.height - 0.15);
						this._ctx.drawImage(this.tilesets[tile.tileType], dx - 0.5, dy - 0.5, tileWidth, tileHeight );
					}
						dx += tileWidth;
				}

				dy += tileHeight;
			}
		} else {
			return;
		}
	}
	renderPlayer() {
		let parentWidth = this.ctx.canvas.parentElement.clientWidth;
		let parentHeight = this.ctx.canvas.parentElement.clientHeight;
		let centerWidth = parentHeight/2;
		let centerHeight = parentHeight/2;
		let rotation = 0;
		// add zoom feature

		// ctx.fillStyle = "rgba(210,210,230,0.05)";
		// ctx.fillRect((centerWidth) * Global.this._zoomLevel - (tileSize / 2), (centerHeight) * Global.this._zoomLevel - (Global.tileSize / 2), 20 * Global.this._zoomLevel, 20 * Global.this._zoomLevel);
		// ctx.strokeStyle = "rgba(200,200,200,1)";
		// ctx.lineWidth = 0.1;
		// ctx.strokeRect(
		// 	centerWidth * Global.this._zoomLevel - Global.tileSize / 2,
		// 	centerHeight * Global.this._zoomLevel - Global.tileSize / 2,
		// 	20 * Global.this._zoomLevel,
		// 	20 * Global.this._zoomLevel
		// );

		this.ctx.beginPath();

		this.ctx.translate(centerWidth, centerHeight);
		if (window.Global.playerDirection === 'n') {
			rotation = 0;
		} else if (window.Global.playerDirection === 'e') {
			rotation = 90;
		} else if (window.Global.playerDirection === 's') {
			rotation = 180;
		} else if (window.Global.playerDirection === 'w') {
			rotation = 270;
		}
		this.ctx.rotate(rotation * Math.PI/180);
		this.ctx.translate(-centerWidth, -centerHeight)

		this.ctx.lineTo(centerWidth, centerHeight - 2.5);
		this.ctx.lineTo(centerWidth + 4, centerHeight + 2);
		this.ctx.lineTo(centerWidth + 3, centerHeight + 2);
		this.ctx.lineTo(centerWidth, centerHeight - 2);
		this.ctx.lineTo(centerWidth - 3, centerHeight + 2);
		this.ctx.lineTo(centerWidth - 4, centerHeight + 2);
		this.ctx.lineTo(centerWidth, centerHeight - 2.5);
		// this.ctx.arc(centerWidth, centerHeight + 1, 2.5, 0, Math.PI, false);
		this.ctx.strokeStyle = "rgba(200,200,200, 1)";
		this.ctx.lineWidth = 2;
		this.ctx.stroke();
		this.ctx.fillStyle = "rgba(200,200,200, 1)";
		this.ctx.fill();
		this.ctx.closePath();

		this.ctx.resetTransform();
	}

	get ctx() {
		return this._ctx;
	}

	set ctx(ctx) {
		this._ctx = ctx;
	}

	get tilesets() {
		return this._tilesets;
	}
}
