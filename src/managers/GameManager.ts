import { LayoutManager } from "./LayoutManager";
import { MapRenderer } from "./map/MapRenderer";
import { PlayerManager } from "./PlayerManager";

import { Manager as ManagerType, Managers } from ".././types";
import { MapManager } from "~/managers/map/MapManager";
import Commands from "./Commands.js";
import * as functions from "../functions.js";
import { Manager } from "./base/Manager";

// import { LayoutManager as LayoutManagerType } from '../types';

export class GameManager extends Manager {
	Managers: Managers;
	imagesLoaded: boolean;
	tileSets: any;

	constructor() {
		super();
		functions.init();
		this.init();
	}

	init() {
		this.Managers = {} as Managers;
		this.LayoutManager = new LayoutManager();
		(this.PlayerManager = new PlayerManager(this)),
			(this.MapRenderer = new MapRenderer(this)),
			(this.MapManager = new MapManager(this)),
			// this.Managers = {
			//     // LayoutManager : new LayoutManager(this),
			// } as Managers;

		this.imagesLoaded = false;

		window.Global = {
			// ...window,
			chunkCount: 0,
			tileCount: 0,
			zoomLevel: 1.15,
			tileSize: 20,
			chunkSize: 15,
			currentChunk: [0, 0],
			playerPosition: [0, 7, 7],
			playerDirection: "n",
			revealAll: true,
			clipping: true,
			seed: "will",
		};

		this.tileSets = this.Managers.MapRenderer.loadImages();



		//window load
		window.addEventListener("load", () => {
			this.view();
		});
	}

	view() {
		this.imagesLoaded = true;
		this.MapRenderer.renderDungeon({tileSets: this.tileSets, ctx: this.mapCtx});
		this.PlayerManager.playerMovement(
			this.tileSets,
			this.mapCtx
		);
		Commands.enableCheatCodes(this.tileSets, this.MapManager.map, this.mapCtx);
	}

	//setters and getters
	set LayoutManager(manager) {
		this.Managers.LayoutManager = manager;
	}

	get LayoutManager() {
		return this.Managers.LayoutManager;
	}

	set PlayerManager(manager) {
		this.Managers.PlayerManager = manager;
	}

	get PlayerManager() {
		return this.Managers.PlayerManager;
	}

	get MapRenderer() {
		return this.Managers.MapRenderer;
	}

	set MapRenderer(manager) {
		this.Managers.MapRenderer = manager;
	}

	get MapManager() {
		return this.Managers.MapManager;
	}

	set MapManager(manager) {
		this.Managers.MapManager = manager;
	}

}
