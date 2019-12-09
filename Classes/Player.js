import View from "../View.js";
import Map from "./Map.js";

export default {
	//player movement here
	playerMovement: function(tileSets, map, ctx) {
		let keyUpEvent;
		keyUpEvent = window.addEventListener("keyup", playerInput);
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
				View.renderDungeon(tileSets, map, ctx);
			} else if (event.key === "ArrowRight" || event.key === "d") {
				if (playerDirection == directions.length - 1) {
					playerDirection = 0;
				} else {
					playerDirection += 1;
				}
				Global.playerDirection = directions[playerDirection];
				View.renderDungeon(tileSets, map, ctx);
			} else if (event.key === "ArrowUp" || event.key === "w") {
                if(map.chunkList[Global.playerPosition[0]][Global.playerPosition[1]][Global.playerPosition[2]].tileBuild[[playerDirection]] !== 'w') {
                    console.log("Pass Go, Collect $200");
                    let relativePosition = Map.directionToPosition(Global.playerDirection);
                    Global.playerPosition[1] += relativePosition[0];
                    Global.playerPosition[2] += relativePosition[1];
                    console.log(relativePosition);
                    View.renderDungeon(tileSets, map, ctx);
                }
            } else if (event.key === "ArrowDown" || event.key ==- "s") {
                if (playerDirection == directions.length - 1 || playerDirection == directions.length - 2) {
                    playerDirection -= 2;
                } else {
                    playerDirection += 2;
                }
                Global.playerDirection = directions[playerDirection];
                View.renderDungeon(tileSets, map, ctx);

            }
            console.log(Global.playerPosition); 
		}
	}
};
