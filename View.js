export default {
	createCanvas: function() {
		var gameCanvas = document.getElementById("game");
		var gameCtx = gameCanvas.getContext("2d");

		gameCanvas.style.position = "absolute";
		gameCanvas.style.top = "0";
		gameCanvas.style.left = "0";
		gameCanvas.width = window.innerWidth;
		gameCanvas.height = window.innerHeight;
	}
};
