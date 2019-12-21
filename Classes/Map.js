import Tiles from "../Data/Tiles.js";

export default {
    init: function() {
        let initialMap = this.createMap();

        initialMap = this.createChunk(Global.chunkSize, initialMap, [0, 0]);
        initialMap.chunkList[0][Global.playerPosition[1]][Global.playerPosition[2]].explored = true;
        initialMap = this.chunkPerimeterCheck(initialMap);

        return initialMap;
    },
    createMap: function() {
        let map = {
            chunkGrid: [[]],
            chunkList: {},
            roomList: { count: 0 }
        };
        return map;
    },

    //need to pass current Position of chunk in chunkGrid?
    chunkPerimeterCheck: function(map, check = false, gridPosition = [0, 0]) {
        let directions = ["n", "e", "s", "w"];
        let relativePosition;
        let relativePositions = [];
        if (!check) {
            directions.forEach((direction, index) => {
                gridPosition = this.getCurrentChunk();
                relativePosition = this.chunkDirectionToPosition(direction, gridPosition);
                if (!this.checkForChunk(relativePosition, map, gridPosition)) {
                    map = this.createChunk(Global.chunkSize, map, relativePosition);
                }
            });
            return map;
        } else {
            directions.forEach((direction, index) => {
                relativePosition = this.chunkDirectionToPosition(direction, gridPosition);
                if (this.checkForChunk(relativePosition, map, gridPosition)) {
                    relativePositions.push(relativePosition);
                } else {
                    relativePositions.push(false);
                }
            });
            return relativePositions;
        }
    },
    checkForChunk: function(relativePosition, map, gridPosition) {
        if (
            relativePosition[0] < 0 ||
            relativePosition[0] > map.chunkGrid.length - 1 ||
            relativePosition[1] < 0 ||
            relativePosition[1] > map.chunkGrid[0].length - 1 ||
            map.chunkGrid[relativePosition[0]][relativePosition[1]] === null
        ) {
            return false;
        } else {
            return true;
        }
    },
    directionToPosition: function(direction) {
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
    },
    chunkDirectionToPosition: function(direction, gridPosition) {
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
    },
    createChunk: function(mapSize, map, gridPosition) {
        var chunk = [];
        for (let i = 0; i < mapSize; i++) {
            chunk[i] = [];
            for (let j = 0; j < mapSize; j++) {
                chunk[i][j] = {
                    tileID: i * mapSize + j,
                    tileHeight: Global.tileSize,
                    tileWidth: Global.tileSize,
                    roomId: null,
                    explored: false,
                    perceptionDirection: [],
                    discovered: false,
                    solid: false,
                };
            }
        }
        chunk.id = Global.chunkCount;
        Global.chunkCount++;
        gridPosition = this.addChunk(map, chunk, gridPosition);
        this.generateChunk(map, gridPosition);
        this.measureRooms(map, chunk.id);
        return map;
    },

    //----------------------------------------
    //-------------generateChunk--------------
    //----------------------------------------

    generateChunk: function(map, gridPosition) {
        let types = ["o", "w", "d"];
        let dungeonChunk = map.chunkList[this.getChunkId(map, gridPosition[0], gridPosition[1])];

        //first pass
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
        let perimeterChunks = this.chunkPerimeterCheck(map, true, gridPosition);

        let northChunk = perimeterChunks[0];
        let eastChunk = perimeterChunks[1];
        let southChunk = perimeterChunks[2];
        let westChunk = perimeterChunks[3];

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
                    tile.tileBuild[0] = this.getTile(
                        map,
                        this.getChunkId(map, northChunk[0], northChunk[1]),
                        Global.chunkSize - 1,
                        spot
                    ).tileType[2];
                }
                //south
                if (rowNum == Global.chunkSize - 1 && southChunk !== false) {
                    tile.tileBuild[2] = this.getTile(
                        map,
                        this.getChunkId(map, southChunk[0], southChunk[1]),
                        0,
                        spot
                    ).tileType[0];
                }
                //west
                if (spot == 0 && westChunk !== false) {
                    tile.tileBuild[3] = this.getTile(
                        map,
                        this.getChunkId(map, westChunk[0], westChunk[1]),
                        rowNum,
                        Global.chunkSize - 1
                    ).tileType[1];
                }
                //east
                if (spot == Global.chunkSize - 1 && eastChunk !== false) {
                    tile.tileBuild[1] = this.getTile(
                        map,
                        this.getChunkId(map, eastChunk[0], eastChunk[1]),
                        rowNum,
                        0
                    ).tileType[3];
                }

                // End modifying dungeon to match previous tiles

                tile.tileType = tile.tileBuild.join("");
            });
        });

        return dungeonChunk;
    },
    
    measureRooms: function(map, chunkId) {
        let dungeonChunk = map.chunkList[chunkId];
        dungeonChunk.forEach((row, rowNum) => {
            row.forEach((tile, spot) => {
                let currentTile = tile;
                if (currentTile.roomId !== null) {

                }
                // while ((currentTile.tileBuild[1] === "o" || currentTile.tileBuild[2] === "o") && rowNum < Global.chunkSize - 1 && spot < Global.chunkSize - 1) {
                //     console.log("this");
                //     if (currentTile.tileBuild[1] === "o") {

                //     } else {

                //     }

                // }

                
            });
        });
        //recursive function here
        function measureRoom (tileLocation) {
            //check if open tile above
                //check for roomID
                // add tileAbove.roomID to currentTile.roomID
                //else 
                // add tile.id to tileAbove.roomID
                // add tileAbove.roomId to tile.roomID
            //check if open tile to right 
                //check for roomID
                // add tileRight.roomID to currentTile.roomID
                //else 
                // add roomID to tileRight.roomID
                // add tileRight.id to roomID
            //check if open tile below
                //check for roomID
                // add tileBelow.roomID to currentTile.roomID
                //else 
                // add roomID to tileBelow.roomID
            //check if open tile to left
                //check for roomID
                // add tileLeft.roomID to currentTile.roomID
                //else 
                // add roomID to tileLeft.roomID
            
        }
        

    },
    addChunk: function(map, chunk, gridPosition) {
        //NEED TO UPDATE Global.currentChunk when a new chunk is added to beginning of either row or a new row is added
        //example: [0,0], should become [1,0] after north is added in initializing
        map.chunkList[chunk.id] = chunk;
        //north
        if (gridPosition[0] < 0) {
            let chunkRow = [];
            map.chunkGrid[0].forEach((location, index) => {
                chunkRow.push(null);
            });
            chunkRow[gridPosition[1]] = chunk.id;
            map.chunkGrid.unshift(chunkRow);
            let currentChunk = [this.getCurrentChunk()[0] + 1, this.getCurrentChunk()[1]];
            this.setCurrentChunk(currentChunk);
            gridPosition[0] = 0;
        //west
        } else if (gridPosition[1] < 0) {
            map.chunkGrid.forEach(row => {
                row.unshift(null);
            });
            map.chunkGrid[gridPosition[0]][0] = chunk.id;
            this.setCurrentChunk([this.getCurrentChunk()[0], this.getCurrentChunk()[1] + 1]);
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
        // this.setCurrentChunk(gridPosition)
        return gridPosition;
    },

    //getters/ setters
    setCurrentChunk: function(currentChunk) {
        Global.currentChunk = currentChunk;
    },
    getCurrentChunk: function() {
        return Global.currentChunk;
    },
    getTile: function(map, chunk, x, y) {
        return map.chunkList[chunk][x][y];
    },
    setTile: function(map, chunk, x, y) {},
    getChunkId: function(map, chunkX, chunkY) {
        return map.chunkGrid[chunkX][chunkY];
    },
    tileIsDiscovered: function(map, chunk, x, y) {
        return map.chunkList[chunk][x][y].discovered;
    },
    tileIsExplored: function(map, chunk, x, y) {
        return map.chunkList[chunk][x][y].explored;
    },
    setTileDiscovered: function(map, chunk, x, y, bool = true) {
        map.chunkList[chunk][x][y].discovered = bool;
    },
    setTileExplored: function(map, chunk, x, y, bool = true) {
        map.chunkList[chunk][x][y].explored = bool;
    },
    discoverTiles: function(
        map,
        playerDirection,
        chunk = Global.playerPosition[0],
        x = Global.playerPosition[1],
        y = Global.playerPosition[2],
        override = false,
        length = 1
    ) {
        let lookingDirection = this.directionToPosition(Global.playerDirection);
        if (this.getTile(map, chunk, x, y).tileBuild[playerDirection] === "o" || override) {
            let chunkGridPosition = getIndexOfK(map.chunkGrid, chunk);
            if (x + lookingDirection[0] === Global.chunkSize) {
                chunkGridPosition[0] += 1;
                chunk = this.getChunkId(map, chunkGridPosition[0], chunkGridPosition[1]);
            } else if (x + lookingDirection[0] < 0) {
            } else if (y + lookingDirection[1] > Global.chunkSize) {
            } else if (y + lookingDirection[1] < 0) {
            }

            this.getTile(map, chunk, x + lookingDirection[0], y + lookingDirection[1]).discovered = true;
        }
    },
    saveGame: function(map) {
        window.localStorage.setItem("dungeonMap", JSON.stringify(map));
        window.localStorage.setItem("playerPosition", JSON.stringify(Global.playerPosition));
        window.localStorage.setItem("playerDirection", JSON.stringify(Global.playerDirection));
        window.localStorage.setItem("currentChunk", JSON.stringify(Global.currentChunk));
        window.localStorage.setItem("mapSeed", Global.seed);
    }
};
