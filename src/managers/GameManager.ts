import { CommandManager } from '~/managers/CommandManager';
import { Manager } from "~/managers/base/Manager";
import { LayoutManager } from "~/managers/LayoutManager";
import { MapRenderer } from "~/managers/map/MapRenderer";
import { PlayerManager } from "~/managers/PlayerManager";
import { MapManager } from "~/managers/map/MapManager";

import { Managers } from "~/types";
import * as functions from "../functions.js";

// import { LayoutManager as LayoutManagerType } from '../types';

export class GameManager extends Manager {
	Managers: Managers;
	imagesLoaded: boolean;

	constructor() {
		super();
		functions.init();
		this.init();
	}

	init() {

		window.Global = {
			// ...window,
			chunkCount: 0,
			tileCount: 0,
			tileSize: 20,
			chunkSize: 15,
			currentChunk: [0, 0],
			playerPosition: [0, 7, 7],
			playerDirection: "n",
			revealAll: false,
			clipping: true,
			seed: "will",
			editLayout: false
		};

		this.Managers = {} as Managers;

		this.LayoutManager = new LayoutManager();
		this.PlayerManager = new PlayerManager(this);
		this.MapRenderer = new MapRenderer(this);
		this.MapManager = new MapManager(this);
		this.CommandManager = new CommandManager(this);
			// this.Managers = {
			//     // LayoutManager : new LayoutManager(this),
			// } as Managers;

		this.imagesLoaded = false;







		//window load
		window.addEventListener("load", () => {
			console.log(this);
			this.view();
		});
	}

	view() {
		this.imagesLoaded = true;
		this.MapRenderer.loadImages();
		this.MapRenderer.renderDungeon();
		this.PlayerManager.playerMovement();
		this.CommandManager.enableCheatCodes(this.MapRenderer.tilesets, this.MapManager.map, this.MapRenderer.ctx);
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

	get CommandManager() {
		return this.Managers.CommandManager;
	}

	set CommandManager(manager) {
		this.Managers.CommandManager = manager;
	}

}
