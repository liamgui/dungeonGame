import Tiles from "../Data/Tiles.js";

export default {
	init: function(mapWidth, mapHeight) {
		var dungeonMap = [];
		for (let i = 0; i < mapHeight; i++) {
			dungeonMap[i] = []
			for (let j = 0; j < mapWidth; j++) {
				dungeonMap[i][j] = {
					tileID: i * mapHeight + j,
					tileHeight: 20,
					tileWidth: 20,
				};
			}
			dungeonMap = this.ProceduralGenerateDungeon(dungeonMap);
		}
		return dungeonMap;
	},
	ProceduralGenerateDungeon: function(dungeonArray) {
		let types = [["o", "w", "d"]];
		Math.seed = 6;

		Math.seedRandom = function(max, min) {
			max = max || 1;
			min = min || 0;

			Math.seed = (Math.seed * 9301 + 49297) % 233280;
			var rnd = Math.seed / 233280;

			return min + rnd * (max - min);
		};

		dungeonArray.forEach((row, rowNum) => {
			row.forEach((tile, spot) => {
				let tileBuild = [];
				for (let s = 0; s < 4; s++) {
					tileBuild[s] = Math.floor(Math.seedRandom() * 3);
				}
				if (rowNum > 0) {
					tileBuild[0] = dungeonArray[rowNum - 1][spot].tileType[2];	
					// console.log(dungeonArray[rowNum - 1][spot]);
					// console.log("hello");
				}
				if (spot > 0) {
					tileBuild[3] = row[spot - 1].tileType[1];
				}
				tileBuild = tileBuild.join('');
				tile.tileType = tileBuild;
				console.log(tile.tileType);
			});
			console.log("next Row");
		});



		return dungeonArray;
	}
};
