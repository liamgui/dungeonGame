import Map from "./Map.js";
import View from "../View.js";
import Commands from "./Commands.js";


export default {
	enableCheatCodes(tileSets, map, ctx) {
        let shiftFlag = false;
        let shiftEvent;

        window.addEventListener('keydown', keydownListener);

        window.addEventListener('keyup',keyupListener);

        function keyupListener(event) {
            if (event.key === "Shift") {
                shiftFlag = false;
                shiftEvent = false;
            }
        }

        function keydownListener(event) {
            if (shiftFlag === true) {
                if (event.key === "C") {
                    event.preventDefault();
                    Commands.clippingOn();
                } else if (event.key === "V") {
                    event.preventDefault();
                    Commands.revealAll(tileSets, map, ctx);
                } else if (event.key === "L") {
                    window.editLayout = !window.editLayout;
                    document.querySelector('body').classList.toggle('edit-layout');
                } else if (event.key === "Delete") {
                    event.preventDefault();
                    window.localStorage.clear();
                } else if (event.key === "S") {
                    event.preventDefault();
                    Map.saveGame(map);
                }
            }
            if (event.key === "Shift") {
                shiftFlag = true;
                shiftEvent = window.addEventListener('keydown', keydownListener);
            }
        }
    },
    revealAll(tileSets, map, ctx) {
        if (Global.revealAll === true) {
            Global.revealAll = false;
            View.renderDungeon(tileSets, map, ctx);
        } else {
            Global.revealAll = true;
            View.renderDungeon(tileSets, map, ctx);
        }
    },
    clippingOn() {
        if (Global.clipping === true) {
            Global.clipping = false;
        } else {
            Global.clipping = true;
        }
    }
}