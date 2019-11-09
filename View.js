export default {
	createCanvas: function() {
		var gameCanvas = document.getElementById("game");
		
		gameCanvas.style.position = "absolute";
		gameCanvas.style.top = "0";
		gameCanvas.style.left = "0";
		gameCanvas.width = window.innerWidth;
		gameCanvas.height = window.innerHeight;
		return gameCanvas
	},
	createContext: function(gameCanvas) {
		return gameCanvas.getContext("2d");
	},
	renderDungeon: function(dungeon, ctx, canvas) {
		let dx,dy;
		dy = 0;
		dungeon.forEach((row, x) => {
			dx = 0;
			row.forEach((tile, y) => {
				console.log(dx, dy);
				ctx.fillStyle = tile.tileType.background;
				ctx.fillRect(
					dx,
					dy,
					tile.tileWidth,
					tile.tileHeight
				);
				ctx.strokeRect(
					dx,
					dy,
					tile.tileWidth,
					tile.tileHeight
				);
				dx += tile.tileWidth;
			});
			// dy += row[x].tile[x];
			dy += dungeon[x][0].tileHeight;
			
		});
	},
};
