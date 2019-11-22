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
				let tileString = [];
				for (let s = 0; s < 4; s++) {
					tileBuild[s] = Math.floor(Math.seedRandom() * 3);
					tileString[s] = types[tileBuild[s]];
				}

				if (rowNum > 0) {
					tileString[0] = dungeonArray[rowNum - 1][spot].tileType[2];
					// console.log(dungeonArray[rowNum - 1][spot]);
					// console.log("hello");
				}
				if (spot > 0) {
					tileString[3] = row[spot - 1].tileType[1];
				}
				tileString = tileString.join('');
				// console.log(tileString);
				tile.tileType = tileString;
			});
		});

		return dungeonArray;
	}
};
