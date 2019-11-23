import Tiles from "../Data/Tiles.js";

export default {
	init: function(mapWidth, mapHeight) {
		var dungeonMap = [];
		for (let i = 0; i < mapHeight; i++) {
			dungeonMap[i] = [];
			for (let j = 0; j < mapWidth; j++) {
				dungeonMap[i][j] = {
					tileID: i * mapHeight + j,
					tileHeight: 20,
					tileWidth: 20
				};
			}
			dungeonMap = this.ProceduralGenerateDungeon(dungeonMap);
		}
		return dungeonMap;
	},
	ProceduralGenerateDungeon: function(dungeonArray) {
		let types = ["o", "w", "d"];
		Math.seed = 'will';

		dungeonArray.forEach((row, rowNum) => {
			row.forEach((tile, spot) => {
				let tileBuild = [];
				//Random generation based on seed
				for (let s = 0; s < 4; s++) {
					let rand = Math.floor(Math.seedRandom(0,10));
					if (rand < 4) {
						tileBuild[s] = types[0];
					}
					else if (rand < 8) {
						tileBuild[s] = types[1];
					} 
					else {
						tileBuild[s] = types[2];
					}
				}
				// End random generation

				//Build the tileName
				tileBuild = tileBuild.join('');
				tile.tileType = tileBuild;
			});
		});
		
		//2nd pass
		dungeonArray.forEach((row, rowNum) => {
			row.forEach((tile, spot) => {
				if(rowNum > 0 && rowNum < (dungeonArray.length - 1) && spot > 0 && spot < (rowNum.length - 1)) {
					let north = dungeonArray[rowNum - 1][spot];
					let northEast = dungeonArray[rowNum - 1][spot + 1];
					let east = row[spot + 1];
					let southEast = dungeonArray[rowNum + 1][spot + 1];
					let south = dungeonArray[rowNum + 1][spot];
					let southWest = dungeonArray[rowNum + 1][spot - 1];
					let west = row[spot - 1];
					let northWest = dungeonArray[rowNum - 1][spot - 1];
				}
				let tileBuild = tile.tileType.split('');
				
				//Modify tiles based on weights of proximity?
				if (rowNum > 0) {
					tileBuild[0] = dungeonArray[rowNum - 1][spot].tileType[2];
				}
				if (spot > 0) {
					tileBuild[3] = row[spot - 1].tileType[1];
				}
				
				if(tileBuild === ['w','w','w','w']) {
					let rand = Math.seedRandom(0,10);
					if (rand < 4) {
						rand = Math.seedRandom(0,3);
						tileBuild[rand] = 'o';
					} else if (rand < 6) {
						rand = Math.seedRandom(0,3);
						tileBuild[rand] = 'd';
					} else if (rand < 8) {
						tile.solid = true;
					}
				}

				// Begin modifying dungeon to match previous tiles
				if (rowNum > 0) {
					tileBuild[0] = dungeonArray[rowNum - 1][spot].tileType[2];
				}
				if (spot > 0) {
					tileBuild[3] = row[spot - 1].tileType[1];
				}
				// End modifying dungeon to match previous tiles

				
				tileBuild = tileBuild.join('');
				tile.tileType = tileBuild;
			});
		})

		return dungeonArray;
	}
};
