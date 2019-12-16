import View from "../View.js";
import Map from "./Map.js";

export default {
	//player movement here
	playerMovement: function(tileSets, map, ctx) {
		let keyDownEvent;
		keyDownEvent = window.addEventListener("keydown", playerInput);
		function playerInput(event) {
			let directions = ["n", "e", "s", "w"];
			let playerDirection = directions.indexOf(Global.playerDirection);
			if (event.key === "ArrowLeft" || event.key === "a") {
				if (playerDirection == 0) {
					playerDirection = directions.length - 1;
				} else {
					playerDirection -= 1;
				}
				Global.playerDirection = directions[playerDirection];
				Map.discoverTiles(map, playerDirection);
				
				View.renderDungeon(tileSets, map, ctx);
			} else if (event.key === "ArrowRight" || event.key === "d") {
				if (playerDirection == directions.length - 1) {
					playerDirection = 0;
				} else {
					playerDirection += 1;
				}
				Global.playerDirection = directions[playerDirection];
				
				Map.discoverTiles(map, playerDirection);
				
				View.renderDungeon(tileSets, map, ctx);
			} else if (event.key === "ArrowDown" || event.key === "s") {
				if (playerDirection == directions.length - 1 || playerDirection == directions.length - 2) {
					playerDirection -= 2;
				} else {
					playerDirection += 2;
				}
				Global.playerDirection = directions[playerDirection];

				Map.discoverTiles(map, playerDirection);
				
				View.renderDungeon(tileSets, map, ctx);
			} else if (event.key === "ArrowUp" || event.key === "w") {
				if (
					map.chunkList[Global.playerPosition[0]][Global.playerPosition[1]][Global.playerPosition[2]].tileBuild[
						[playerDirection]
					] !== "w" ||
					Global.clipping === true
					) {
						let relativePosition = Map.directionToPosition(Global.playerDirection);
						// console.log(relativePosition);
						Global.playerPosition[1] += relativePosition[0];
						Global.playerPosition[2] += relativePosition[1];
						if (Global.playerPosition[1] >= Global.chunkSize) {
							Global.currentChunk[0] += 1;
							Global.playerPosition[0] = map.chunkGrid[Global.currentChunk[0]][Global.currentChunk[1]];
							Global.playerPosition[1] = 0;
						} else if (Global.playerPosition[1] < 0) {
							Global.currentChunk[0] -= 1;
							Global.playerPosition[0] = map.chunkGrid[Global.currentChunk[0]][Global.currentChunk[1]];
							Global.playerPosition[1] = Global.chunkSize - 1;
						} else if (Global.playerPosition[2] >= Global.chunkSize) {
							Global.currentChunk[1] += 1;
							Global.playerPosition[0] = map.chunkGrid[Global.currentChunk[0]][Global.currentChunk[1]];
							Global.playerPosition[2] = 0;
						} else if (Global.playerPosition[2] < 0) {
							Global.currentChunk[1] -= 1;
							Global.playerPosition[0] = map.chunkGrid[Global.currentChunk[0]][Global.currentChunk[1]];
							Global.playerPosition[2] = Global.chunkSize - 1;
						}
						Map.chunkPerimeterCheck(map, false, Global.currentChunk);
						map.chunkList[Global.playerPosition[0]][Global.playerPosition[1]][Global.playerPosition[2]].explored = true;
						
						Map.discoverTiles(map, playerDirection);
						
						View.renderDungeon(tileSets, map, ctx);
					}
			}
			// console.log(Global.playerPosition);
			// console.log(Global.playerDirection);
			// console.log(map)
			//CLEAN UP SAVEGAME
		}
		return map;
	}
};
