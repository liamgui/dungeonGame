// import { GameManager } from '~/types';
import { GameManager } from '~/managers/GameManager';
import { Manager } from "~/managers/base/Manager";

export class PlayerManager extends Manager{
    constructor(private GameManager: GameManager) {
		super();
    }
	//player movement here
	playerMovement(tileSets, ctx) {
		let map = this.GameManager.MapManager.map;
		let keyDownEvent = window.addEventListener("keydown", (event) => {this.playerInput(event, map, tileSets, ctx)});
		return map;
	}
    playerInput(event, map, tileSets, ctx) {
        let directions = ["n", "e", "s", "w"];
        let playerDirection = directions.indexOf(window.Global.playerDirection);
        if (event.key === "ArrowLeft" || event.key === "a") {
            if (playerDirection == 0) {
                playerDirection = directions.length - 1;
            } else {
                playerDirection -= 1;
            }
            window.Global.playerDirection = directions[playerDirection];
            this.GameManager.MapManager.discoverTiles(playerDirection);
            this.GameManager.MapRenderer.renderDungeon({tileSets, ctx});
        } else if (event.key === "ArrowRight" || event.key === "d") {
            if (playerDirection == directions.length - 1) {
                playerDirection = 0;
            } else {
                playerDirection += 1;
            }
            window.Global.playerDirection = directions[playerDirection];

            this.GameManager.MapManager.discoverTiles(playerDirection);

            this.GameManager.MapRenderer.renderDungeon({tileSets, ctx});
        } else if (event.key === "ArrowDown" || event.key === "s") {
            if (playerDirection == directions.length - 1 || playerDirection == directions.length - 2) {
                playerDirection -= 2;
            } else {
                playerDirection += 2;
            }
            window.Global.playerDirection = directions[playerDirection];

            this.GameManager.MapManager.discoverTiles(playerDirection);

            this.GameManager.MapRenderer.renderDungeon({tileSets, ctx});
        } else if (event.key === "ArrowUp" || event.key === "w") {
            if (
                this.GameManager.MapManager.getTile({chunk: this.GameManager.MapManager.playerPosition[0], x: this.GameManager.MapManager.playerPosition[1], y: this.GameManager.MapManager.playerPosition[2]}).tileBuild[playerDirection] !== "w" ||
                window.Global.clipping === true
                ) {
                    let relativePosition = this.GameManager.MapManager.directionToPosition(window.Global.playerDirection);
                    this.GameManager.MapManager.playerPosition[1] += relativePosition[0];
                    this.GameManager.MapManager.playerPosition[2] += relativePosition[1];
                    if (this.GameManager.MapManager.playerPosition[1] >= this.GameManager.MapManager.chunkSize) {
                        this.GameManager.MapManager.currentChunk[0] += 1;
                        this.GameManager.MapManager.playerPosition[0] = this.GameManager.MapManager.getChunkId({map, chunkX: this.GameManager.MapManager.currentChunk[0], chunkY: this.GameManager.MapManager.currentChunk[1]});
                        this.GameManager.MapManager.playerPosition[1] = 0;
                    } else if (this.GameManager.MapManager.playerPosition[1] < 0) {
                        this.GameManager.MapManager.currentChunk[0] -= 1;
                        this.GameManager.MapManager.playerPosition[0] = this.GameManager.MapManager.getChunkId({map, chunkX: this.GameManager.MapManager.currentChunk[0], chunkY: this.GameManager.MapManager.currentChunk[1]});
                        this.GameManager.MapManager.playerPosition[1] = this.GameManager.MapManager.chunkSize - 1;
                    } else if (this.GameManager.MapManager.playerPosition[2] >= this.GameManager.MapManager.chunkSize) {
                        this.GameManager.MapManager.currentChunk[1] += 1;
                        this.GameManager.MapManager.playerPosition[0] = this.GameManager.MapManager.getChunkId({map, chunkX: this.GameManager.MapManager.currentChunk[0], chunkY: this.GameManager.MapManager.currentChunk[1]});
                        this.GameManager.MapManager.playerPosition[2] = 0;
                    } else if (this.GameManager.MapManager.playerPosition[2] < 0) {
                        this.GameManager.MapManager.currentChunk[1] -= 1;
                        this.GameManager.MapManager.playerPosition[0] = this.GameManager.MapManager.getChunkId({map, chunkX: this.GameManager.MapManager.currentChunk[0], chunkY: this.GameManager.MapManager.currentChunk[1]});
                        this.GameManager.MapManager.playerPosition[2] = this.GameManager.MapManager.chunkSize - 1;
                    }
                    this.GameManager.MapManager.chunkPerimeterCheck(map, false, this.GameManager.MapManager.currentChunk);

                    this.GameManager.MapManager.setTileExplored(this.GameManager.MapManager.playerPosition[0], this.GameManager.MapManager.playerPosition[1], this.GameManager.MapManager.playerPosition[2]);

                    this.GameManager.MapManager.discoverTiles(playerDirection);
                    this.GameManager.MapRenderer.renderDungeon({tileSets, ctx});
                }
        }
        //CLEAN UP SAVEGAME
    }

};
