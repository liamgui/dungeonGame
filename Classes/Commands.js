import Map from "./Map.js";
import View from "../View.js";


export default {
	enableCheatCodes: function(tileSets, map, ctx) {
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
                    if (Global.clipping === true) {
                        Global.clipping = false;
                    } else {
                        Global.clipping = true;
                    }
                } else if (event.key === "V") {
                    event.preventDefault();
                    if (Global.revealAll === true) {
                        Global.revealAll = false;
                        View.renderDungeon(tileSets, map, ctx);
                    } else {
                        Global.revealAll = true;
                        View.renderDungeon(tileSets, map, ctx);
                    }
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
    }
}