var gameCanvas = document.getElementById("game");
var gameCtx = gameCanvas.getContext("2d");

gameCanvas.style.position = "absolute";
gameCanvas.style.top = "0";
gameCanvas.style.left = "0";
gameCanvas.width = window.innerWidth;
gameCanvas.height = window.innerHeight;

var game = new Game();
var unitPositionX = 200;
var unitPositionY = 200;

function Game() 
{
    this.unit = function unit(unitPositionX, unitPositionY) {
        gameCtx.beginPath();
        gameCtx.arc(unitPositionX, unitPositionY, 10, Math.PI * 2, false);
        gameCtx.fillStyle("black");
        gameCtx.fill();
    }

}



