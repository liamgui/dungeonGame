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
		dungeonArray.forEach(row => {
			row.forEach(tile => {
				tile.tileType = Tiles.openRoom;
				console.log(tile.tileType)
			});
		});
		return dungeonArray;
	}
};
