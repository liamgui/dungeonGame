import Tiles from "../Data/Tiles.js";

export default {
	init: function(width, height) {
		var dungeonMap = [];
		for (let i = 0; i < height; i++) {
			dungeonMap[i] = [];
			for (let j = 0; j < width; j++) {
				dungeonMap[i][j] = {
					tileID: i * height + j,
					tileHeight: 17.5,
					tileWidth: 17.5,
				};
			}
			dungeonMap = this.ProceduralGenerateDungeon(dungeonMap);
		}
		return dungeonMap;
	},
	ProceduralGenerateDungeon: function(dungeonArray) {
		dungeonArray.forEach(row => {
			row.forEach(tile => {
				tile.tileType = Tiles.tileTypes.unexplored;
			});
		});
		return dungeonArray;
	}
};
