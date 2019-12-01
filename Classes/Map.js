import Tiles from "../Data/Tiles.js";

export default {
	init: function() {		
		let chunkSize = 15;
		let initialMap = this.createMap();

		let firstChunk = this.createChunk(chunkSize);
		initialMap = this.addChunk(initialMap, firstChunk);
		this.chunkPerimeterCheck(firstChunk, initialMap);
		for (let count = 0; count < 4; count++) {
			let chunk = this.createChunk(chunkSize);
			initialMap = this.addChunk(initialMap, chunk);

		}
		console.log(initialMap);
		return initialMap;
	},
	//need to pass current Position of chunk in chunkGrid?
	chunkPerimeterCheck: function(currentChunkPosition, map) {
		let directions = ['n','e','s','w'];
		let nextPosition;
		directions.forEach((direction, index) => {
			nextPosition = this.directionToPosition(direction);
			this.checkForChunk(nextPosition, map);
		});
	},
	checkForChunk: function(position, map) {
		console.log(position);
		if (map.chunkGrid[position[0]][position[1]] ==) {
			
		}
	},
	directionToPosition: function(direction) {
		let position = [];
		if (direction === 'n') {
			position = [-1, 0];
		} else if (direction === 'e') {
			position = [0, 1];
		} else if (direction === 's') {
			position = [1, 0];
		} else if (direction === 'w') {
			position = [0,-1];
		}
		return position;
	},
	createChunk: function(mapSize) {
		var chunk = [];
		for (let i = 0; i < mapSize; i++) {
			chunk[i] = [];
			for (let j = 0; j < mapSize; j++) {
				chunk[i][j] = {
					tileID: i * mapSize + j,
					tileHeight: 20,
					tileWidth: 20
				};
			}
		}
		chunk.id = Global.chunkCount;
		Global.chunkCount++;
		chunk = this.generateChunk(chunk);
		return chunk;
	},

	generateChunk: function(dungeonChunk) {
		let types = ["o", "w", "d"];
		dungeonChunk.forEach((row, rowNum) => {
			row.forEach((tile, spot) => {
				let tileBuild = [];
				//Random generation based on seed
				for (let s = 0; s < 4; s++) {
					let rand = Math.floor(Math.seedRandom(0, 10));
					if (rand < 4) {
						tileBuild[s] = types[0];
					} else if (rand < 8) {
						tileBuild[s] = types[1];
					} else {
						tileBuild[s] = types[2];
					}
				}
				// End random generation

				//Build the tileName
				tile.tileBuild = tileBuild;
				tileBuild = tileBuild.join("");
				tile.tileType = tileBuild;
			});
		});

		//2nd pass
		dungeonChunk.forEach((row, rowNum) => {
			row.forEach((tile, spot) => {
				if (rowNum > 0 && rowNum < dungeonChunk.length - 1 && spot > 0 && spot < rowNum.length - 1) {
					let north = dungeonChunk[rowNum - 1][spot];
					let northEast = dungeonChunk[rowNum - 1][spot + 1];
					let east = row[spot + 1];
					let southEast = dungeonChunk[rowNum + 1][spot + 1];
					let south = dungeonChunk[rowNum + 1][spot];
					let southWest = dungeonChunk[rowNum + 1][spot - 1];
					let west = row[spot - 1];
					let northWest = dungeonChunk[rowNum - 1][spot - 1];
				}

				//Modify tiles based on weights of proximity?
				if (rowNum > 0) {
					tile.tileBuild[0] = dungeonChunk[rowNum - 1][spot].tileType[2];
				}
				if (spot > 0) {
					tile.tileBuild[3] = row[spot - 1].tileType[1];
				}
			});
		});
		//final pass
		dungeonChunk.forEach((row, rowNum) => {
			row.forEach((tile, spot) => {
				if (tile.tileBuild === ["w", "w", "w", "w"]) {
					let rand = Math.seedRandom(0, 10);
					if (rand < 4) {
						rand = Math.seedRandom(0, 3);
						tile.tileBuild[rand] = "o";
					} else if (rand < 6) {
						rand = Math.seedRandom(0, 3);
						tile.tileBuild[rand] = "d";
					} else if (rand < 8) {
						tile.solid = true;
					}
				}

				// Begin modifying dungeon to match previous tiles
				if (rowNum > 0) {
					tile.tileBuild[0] = dungeonChunk[rowNum - 1][spot].tileType[2];
				}
				if (spot > 0) {
					tile.tileBuild[3] = row[spot - 1].tileType[1];
				}
				// End modifying dungeon to match previous tiles

				tile.tileType = tile.tileBuild.join("");
			});
		});

		return dungeonChunk;
	},

	createMap: function() {
		let map = {
			chunkGrid: [[]],
			chunkList: {}
		};
		return map;
	},

	addChunk: function(map, chunk) {
		map.chunkList[chunk.id] = chunk;
		map.chunkGrid
		return map;
	}
};
