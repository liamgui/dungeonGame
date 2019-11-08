import Tiles from "../Data/Tiles.js";

export default {
	init: function(width, height) {
		var dungeonMap = [];
		for (let i = 0; i < height; i++) {
			dungeonMap[i] = [];
			for (let j = 0; j < width; j++) {
				dungeonMap[i][j] = {
					tileID: i * height + j,
					tileHeight: '10px',
					tileWidth: '10px',
				};
			}
			dungeonMap = this.ProceduralGenerateDungeon(dungeonMap);
		}
		return dungeonMap;
	},
	ProceduralGenerateDungeon: function(dungeonArray) {
		dungeonArray.forEach(row => {
			row.forEach(tile => {
				tile.tileType = Tiles.tileTypes.solidRoom;
			});
		});
		return dungeonArray;
	}
};
