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
		// Math.seed = 0;

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
					} else {
						tileBuild[s] = types[2];
					}
				}
				// End random generation

				//Modify tiles based on weights of proximity?

				// Begin modifying dungeon to match previous tiles
				if (rowNum > 0) {
					tileBuild[0] = dungeonArray[rowNum - 1][spot].tileType[2];
				}
				if (spot > 0) {
					tileBuild[3] = row[spot - 1].tileType[1];
				}
				// End modifying dungeon to match previous tiles

				//Build the tileName
				tileBuild = tileBuild.join('');
				tile.tileType = tileBuild;
			});
		});

		return dungeonArray;
	}
};
