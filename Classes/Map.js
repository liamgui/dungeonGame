export default {
	init: function(width, height) {
		var dungeonMap = [];
		for (let i = 0; i < height; i++) {
			dungeonMap[i] = [];
			for (let j = 0; j < width; j++) {
				dungeonMap[i][j] = {
					tileID: i * height + j,
				};
			}
		}
		return dungeonMap;
	},
	ProceduralGenerateDungeon: function(dungeonArray) {
		
		return ;
	}
};
