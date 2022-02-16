import { GameManager } from '~/managers/GameManager';
import { Manager } from "~/managers/base/Manager";

import * as functions from "~/functions.js";
export class MapManager extends Manager {
	private _map: any;
	private _currentChunk: number[];
	private _chunkSize: number;
	private _chunkCount: number;
	private _tileCount: number;
	private _tileSize: number;
	private _playerPosition: number[];

    constructor(private GameManager: GameManager) {
        super();
		this._chunkCount = 0;
		this._tileCount = 0;
		this._tileSize = 20;
		this._chunkSize = 15;
		this._currentChunk = [0, 0];
		let x = 0;
		let y = Math.floor(this._chunkSize/2);
		let z = Math.floor(this._chunkSize/2);
		this._playerPosition = [x, y, z];
		this.generate();
    }
    generate() {
        this._map = this.createMap();
        this.createChunk([0, 0]);
		console.log(this._map);
        this._map.chunkList[0][this._playerPosition[1]][this._playerPosition[2]].explored = true;
        this.chunkPerimeterCheck({});
    }
    createMap() {
        let map = {
            chunkGrid: [[]],
            chunkList: {},
            roomList: []
        };
        return map;
    }

    //need to pass current Position of chunk in chunkGrid?
    chunkPerimeterCheck({check = false, gridPosition = [0, 0]}) {
        let directions = ["n", "e", "s", "w"];
        let relativePosition;
        let relativePositions = [];
        if (!check) {
            directions.forEach((direction, index) => {
                gridPosition = this.currentChunk;
                relativePosition = this.chunkDirectionToPosition(direction, gridPosition);
                if (!this.checkForChunk(relativePosition)) {
					this.createChunk(relativePosition);
                }
            });
        } else {
			directions.forEach((direction, index) => {
				relativePosition = this.chunkDirectionToPosition(direction, gridPosition);
                if (this.checkForChunk(relativePosition)) {
                    relativePositions.push(relativePosition);
                } else {
                    relativePositions.push(false);
                }
            });
            return relativePositions;
        }
    }



    checkForChunk(relativePosition) {
        if (
            relativePosition[0] < 0 ||
            relativePosition[0] > this._map.chunkGrid.length - 1 ||
            relativePosition[1] < 0 ||
            relativePosition[1] > this._map.chunkGrid[0].length - 1 ||
            this._map.chunkGrid[relativePosition[0]][relativePosition[1]] === null
        ) {
            return false;
        } else {
            return true;
        }
    }
    directionToPosition(direction) {
        let relativePosition = [];
        if (direction === "n") {
            relativePosition = [-1, 0];
        } else if (direction === "e") {
            relativePosition = [0, 1];
        } else if (direction === "s") {
            relativePosition = [1, 0];
        } else if (direction === "w") {
            relativePosition = [0, -1];
        }
        return relativePosition;
    }
    chunkDirectionToPosition(direction, gridPosition) {
        let relativePosition = [];
        if (direction === "n") {
            relativePosition = [gridPosition[0] + -1, gridPosition[1] + 0];
        } else if (direction === "e") {
            relativePosition = [gridPosition[0] + 0, gridPosition[1] + 1];
        } else if (direction === "s") {
            relativePosition = [gridPosition[0] + 1, gridPosition[1] + 0];
        } else if (direction === "w") {
            relativePosition = [gridPosition[0] + 0, gridPosition[1] + -1];
        }
        return relativePosition;
    }
    findRelativePosition(direction, currentPosition) {
        let y = currentPosition[1] + this.directionToPosition(direction)[1];
        let x = currentPosition[0] + this.directionToPosition(direction)[0];
        return [x, y];
    }
    createChunk(gridPosition) {
		let map = this._map;
		let chunkSize = this._chunkSize;
        let chunk:any = {};

        for (let i = 0; i < chunkSize; i++) {
            chunk[i] = [];
            for (let j = 0; j < chunkSize; j++) {
                chunk[i][j] = {
                    tileID: this._tileCount,
                    tileHeight: this._tileSize,
                    tileWidth: this._tileSize,
                    roomId: null,
                    explored: false,
                    perceptionDirection: [],
                    discovered: false,
                    solid: false
                };
                this._tileCount++;
            }
        }
        chunk.id = this._chunkCount;
        this._chunkCount++;
        gridPosition = this.addChunk(chunk, gridPosition);
        this.generateChunk(gridPosition);
        this.measureRooms(map, chunk.id);
		// console.log(map);
        this._map = map;
    }

    //----------------------------------------
    //-------------generateChunk--------------
    //----------------------------------------

    generateChunk(gridPosition) {
		let map = this._map;
        let types = ["o", "w", "d"];
        let dungeonChunk = map.chunkList[this.getChunkId({map, chunkX: gridPosition[0], chunkY: gridPosition[1]})];
		console.log(dungeonChunk);
        //first pass
		let newChunk = {};
		for (let rowIndex in dungeonChunk) {
			let row = dungeonChunk[rowIndex];
			let rowNum = parseInt(rowIndex);
			for (let tileIndex in row) {
				let tile = row[tileIndex];
				let spot = parseInt(tileIndex);
                let tileBuild: any = [];
                //Random generation based on seed
                for (let s = 0; s < 4; s++) {
                    let rand = Math.floor(Math.seedRandom({min: 0, max: 10}));
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
            }
        }

        //second pass
        // dungeonChunk.forEach((row, rowNum) => {
        // 	row.forEach((tile, spot) => {
        // 		//2nd pass
        // 		if (rowNum > 0 && rowNum < dungeonChunk.length - 1 && spot > 0 && spot < rowNum.length - 1) {
        // 			let north = dungeonChunk[rowNum - 1][spot];
        // 			let northEast = dungeonChunk[rowNum - 1][spot + 1];
        // 			let east = row[spot + 1];
        // 			let southEast = dungeonChunk[rowNum + 1][spot + 1];
        // 			let south = dungeonChunk[rowNum + 1][spot];
        // 			let southWest = dungeonChunk[rowNum + 1][spot - 1];
        // 			let west = row[spot - 1];
        // 			let northWest = dungeonChunk[rowNum - 1][spot - 1];
        // 		}

        // 		//!Modify tiles based on weights of proximity?
        // 		// if (rowNum > 0) {
        // 		// 	tile.tileBuild[0] = dungeonChunk[rowNum - 1][spot].tileType[2];
        // 		// }
        // 		// if (spot > 0) {
        // 		// 	tile.tileBuild[3] = row[spot - 1].tileType[1];
        // 		// }
        // 	});
        // });
        //

        //-----------
        // final pass
        let perimeterChunks = this.chunkPerimeterCheck({check: true, gridPosition});
		//FIXME how this is rendering o,o,o,o????
        let northChunk = perimeterChunks[0];
        let eastChunk = perimeterChunks[1];
        let southChunk = perimeterChunks[2];
        let westChunk = perimeterChunks[3];
		for (let rowIndex in dungeonChunk) {
			let row = dungeonChunk[rowIndex];
			let rowNum = parseInt(rowIndex);
			for (let tileIndex in row) {
				let tile = row[tileIndex];
				let spot = parseInt(tileIndex);                if (tile.tileBuild === ["w", "w", "w", "w"]) {
                    let rand = Math.seedRandom({min: 0, max: 10});
                    if (rand < 4) {
                        rand = Math.seedRandom({min: 0, max: 3});
                        tile.tileBuild[rand] = "o";
                    } else if (rand < 6) {
                        rand = Math.seedRandom({min: 0, max: 3});
                        tile.tileBuild[rand] = "d";
                    } else if (rand < 8) {
                        tile.solid = true;
                    }
                }

                // Begin modifying dungeon to match previous tiles
                if (rowNum > 0) {
                    //all tiles unless it is the first row of chunk
                    tile.tileBuild[0] = dungeonChunk[rowNum - 1][spot].tileType[2];
                }

                if (spot > 0) {
                    // all tiles unless it is the first column of chunk
                    tile.tileBuild[3] = row[spot - 1].tileType[1];
                }

                // Begin modifying dungeon to match neighboring chunk tiles

                //north
                if (rowNum == 0 && northChunk !== false) {
                    tile.tileBuild[0] = this.getTile({
                        map,
                        chunk: this.getChunkId({map, chunkX: northChunk[0], chunkY: northChunk[1]}),
                        x: this._chunkSize - 1,
                        y: spot
					}).tileType[2];
                }
                //south
                if (rowNum == this._chunkSize - 1 && southChunk !== false) {
                    tile.tileBuild[2] = this.getTile({
                        map,
                        chunk: this.getChunkId({map, chunkX: southChunk[0], chunkY: southChunk[1]}),
                        x: 0,
                        y: spot
					}).tileType[0];
                }
                //west
                if (spot == 0 && westChunk !== false) {
                    tile.tileBuild[3] = this.getTile({
                        map,
                        chunk: this.getChunkId({map, chunkX: westChunk[0], chunkY: westChunk[1]}),
                        x: rowNum,
                        y: this._chunkSize - 1
					}).tileType[1];
                }
                //east
                if (spot == this._chunkSize - 1 && eastChunk !== false) {
                    tile.tileBuild[1] = this.getTile({
                        map,
                        chunk: this.getChunkId({map, chunkX: eastChunk[0], chunkY: eastChunk[1]}),
                        x: rowNum,
                        y: 0
					}).tileType[3];
                }

                // End modifying dungeon to match previous tiles

                tile.tileType = tile.tileBuild.join("");
            }
        }

        return dungeonChunk;
    }

    measureRooms(map, chunkId) {
        let dungeonChunk = map.chunkList[chunkId];
		for (let rowIndex in dungeonChunk) {
			let row = dungeonChunk[rowIndex];
			let rowNum = parseInt(rowIndex);
			for (let tileIndex in row) {
				let tile = row[tileIndex];
				let spot = parseInt(tileIndex);
                let currentTile = tile;
                let roomId;
                if (currentTile.roomId === null) {
                    roomId = map.roomList.length;
                    map.roomList[roomId] = [];
                    //code here
                    this.measureRoom([rowNum, spot], currentTile, roomId, map, dungeonChunk);
                }
            }
        }
    }

    measureRoom(tileLocation, tile, roomId, map, dungeonChunk) {
        //recursive function here
            //check if open tile above
            let nextTile;
            let nextTileLocation;
            tile.roomId = roomId;
            map.roomList[roomId].push(tile.tileID);
            // console.log(tileLocation);
            let directions = ["n", "e", "s", "w"];
            for (let i = 0; i < 4; i++) {
                if (tile.tileBuild[i] === "o") {
                    nextTileLocation = this.findRelativePosition(directions[i], tileLocation);
                    if (
                        nextTileLocation[0] >= 0 &&
                        nextTileLocation[1] >= 0 &&
                        nextTileLocation[0] < this._chunkSize &&
                        nextTileLocation[1] < this._chunkSize
                    )
                    {
                        nextTile = dungeonChunk[nextTileLocation[0]][nextTileLocation[1]];
                        if (nextTile !== undefined) {
                            if (nextTile.roomId === null) {
                                this.measureRoom(nextTileLocation, nextTile, roomId, map, dungeonChunk);
                            }
                        }
                    }
                }
            }
    }
    addChunk(chunk, gridPosition) {
        //NEED TO UPDATE this.GameManager.MapManager.currentChunk when a new chunk is added to beginning of either row or a new row is added
        //example: [0,0], should become [1,0] after north is added in initializing
		let map = this._map;
        map.chunkList[chunk.id] = chunk;
        //north
        if (gridPosition[0] < 0) {
            let chunkRow = [];
            map.chunkGrid[0].forEach((location, index) => {
                chunkRow.push(null);
            });
            chunkRow[gridPosition[1]] = chunk.id;
            map.chunkGrid.unshift(chunkRow);
            let currentChunk = [this.currentChunk[0] + 1, this.currentChunk[1]];
            this.currentChunk = currentChunk;
            gridPosition[0] = 0;
            //west
        } else if (gridPosition[1] < 0) {
            map.chunkGrid.forEach(row => {
                row.unshift(null);
            });
            map.chunkGrid[gridPosition[0]][0] = chunk.id;
            this.currentChunk = [this.currentChunk[0], this.currentChunk[1] + 1];
            gridPosition[1] = 0;
            //south
        } else if (gridPosition[0] >= map.chunkGrid.length) {
            let chunkRow = [];
            map.chunkGrid[0].forEach((location, index) => {
                chunkRow.push(null);
            });
            chunkRow[gridPosition[1]] = chunk.id;
            map.chunkGrid.push(chunkRow);
            //east
        } else if (gridPosition[1] >= map.chunkGrid[gridPosition[0]].length) {
            map.chunkGrid.forEach(row => {
                row.push(null);
            });
            map.chunkGrid[gridPosition[0]][gridPosition[1]] = chunk.id;
        } else {
            map.chunkGrid[gridPosition[0]][gridPosition[1]] = chunk.id;
        }
        // this.cCurrentChunk = gridPosition
        return gridPosition;
    }

    //getters/ setters

    getTile({chunk, x, y, map = null}) {
		console.log(x);
		if (x < 0 || y < 0 || x >= this._chunkSize || y >= this._chunkSize) {
			console.log({chunk});
			console.log({x});	
			let chunkGridPosition = this.getChunkGridPosition(chunk);
			if (x == -1) {
				chunk = this.getChunkId({chunkX: chunkGridPosition[0] - 1, chunkY: chunkGridPosition[1]});
				x = this._chunkSize - 1;
				console.log(chunk);
				console.log(x);
			} else if (y == -1) {

			} else if (x == this._chunkSize) {

			} else if (y == this._chunkSize) {

			}
		}

		if (map) return map.chunkList[chunk][x][y];
        return this._map.chunkList[chunk][x][y];
    }
    setTile(map, chunk, x, y) {

    }
    getNeighboringTiles(tile) {
        return tile.neighboringTiles;
    }
    getChunkId({chunkX, chunkY, map = null}) {
		if (map) return map.chunkGrid[chunkX][chunkY];
        return this._map.chunkGrid[chunkX][chunkY];
    }
	getChunkGridPosition(chunkId) {
		return (functions.getIndexOfK(this._map.chunkGrid, chunkId));
	}

    tileIsDiscovered(chunk, x, y) {
        return this._map.chunkList[chunk][x][y].discovered;
    }
    tileIsExplored(chunk, x, y) {
        return this._map.chunkList[chunk][x][y].explored;
    }
    setTileDiscovered(chunk, x, y, bool = true) {
        this._map.chunkList[chunk][x][y].discovered = bool;
    }
    setTileExplored(chunk, x, y, bool = true) {
        this._map.chunkList[chunk][x][y].explored = bool;
    }
    discoverTiles(
		//FIXME player position is not being changed!!!
        playerDirection = window.Global.playerDirection,
        chunk = this._playerPosition[0],
        x = this._playerPosition[1],
        y = this._playerPosition[2],
        override = false,
        length = 1
    ) {
        let directions = ['n', 'e', 's', 'w'];
        let lookingDirection = this.directionToPosition(window.Global.playerDirection);
		console.log(lookingDirection);
		console.log("Discovering tiles");
        if (this.getTile({chunk, x, y}).tileBuild[playerDirection] === "o" || override) {
            let chunkGridPosition = functions.getIndexOfK(this._map.chunkGrid, chunk);
            if (x + lookingDirection[0] === this._chunkSize) {
                chunkGridPosition[0] += 1;
                chunk = this.getChunkId({chunkX: chunkGridPosition[0], chunkY: chunkGridPosition[1]});
            } else if (x + lookingDirection[0] < 0) {
            } else if (y + lookingDirection[1] > this._chunkSize) {
            } else if (y + lookingDirection[1] < 0) {
            }
            this.getTile({chunk, x: x + lookingDirection[1], y: y + lookingDirection[0]}).discovered = true;
        }
    }
    saveGame() {
        window.localStorage.setItem("dungeonMap", JSON.stringify(this._map));
        window.localStorage.setItem("playerPosition", JSON.stringify(this._playerPosition));
        window.localStorage.setItem("playerDirection", JSON.stringify(window.Global.playerDirection));
        window.localStorage.setItem("currentChunk", JSON.stringify(this.GameManager.MapManager.currentChunk));
        window.localStorage.setItem("mapSeed", window.Global.seed);
    }

	get map() {
		return this._map;
	}

	get tileSize() {
		return this._tileSize;
	}

	get chunkSize() {
		return this._chunkSize;
	}

	get playerPosition() {
		return this._playerPosition;
	}

	get currentChunk() {
		return this._currentChunk;
	}

	set currentChunk(currentChunk) {
		this._currentChunk = currentChunk;
	}

};
