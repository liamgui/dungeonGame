import { GameManager } from '~/managers/GameManager';
import { Manager } from '~/managers/base/Manager';



export class CommandManager extends Manager{
	private _shiftFlag: Boolean;
	private _shiftEvent: any;

	constructor (private GameManager: GameManager) {
		super();
		this._shiftFlag = false;
	}
	keyupListener(event) {
		if (event.key === "Shift") {
			this._shiftFlag = false;
			this._shiftEvent = false;
		}
	}


	keydownListener(event) {
		if (this._shiftFlag === true) {
			if (event.key === "C") {
				event.preventDefault();
				this.clippingOn();
			} else if (event.key === "V") {
				event.preventDefault();
				this.revealAll();
			} else if (event.key === "L") {
				window.Global.editLayout = !window.Global.editLayout;
				document.querySelector('body').classList.toggle('edit-layout');
			} else if (event.key === "Delete") {
				event.preventDefault();
				window.localStorage.clear();
			} else if (event.key === "S") {
				event.preventDefault();
				this.GameManager.MapManager.saveGame();
			}
		}
		if (event.key === "Shift") {
			this._shiftFlag = true;
			this._shiftEvent = window.addEventListener('keydown', this.keydownListener);
		}
	}
	enableCheatCodes(tilesets, map, ctx) {


        window.addEventListener('keydown', this.keydownListener);

        window.addEventListener('keyup', this.keyupListener);


    }

    revealAll() {
		window.Global.revealAll = !window.Global.revealAll;
		this.GameManager.MapRenderer.renderDungeon();
    }

    clippingOn() {
		window.Global.clipping = !window.Global.clipping;
    }
}