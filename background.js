var background = document.getElementById("background");
var backgroundContext = background.getContext("2d");


background.width = window.innerWidth;
background.height = window.innerHeight;

var backgroundHeight = window.innerHeight;
var backgroundWidth = window.innerWidth;


var backgroundArray = new Array();
for (var s = 0; s < (backgroundWidth); s++) {
    backgroundArray[s] = [];
    for (var t = 0; t < (backgroundHeight); t++) {
        backgroundArray[s][t] = 1;
    }
}

var backgroundImage = new Image();


// backgroundImage.onload = function() {
//                 backgroundContext.drawImage(backgroundImage, posX, posY, 20, 20);

backgroundImage.onload = drawBackground;
var me = this;

function drawBackground () {

var posX = 0;
var posY = 0;
var backgroundTileWidth = backgroundImage.width;
var backgroundTileHeight = backgroundImage.height;


for (var i = 0; i < backgroundArray.length; i++) {
    for (var j = 0; j < backgroundArray[i].length; j++) {
        if (backgroundArray[i][j] === 1) {
                backgroundContext.drawImage(this, posX, posY, backgroundTileWidth, backgroundTileHeight);
            
        }
        posX += backgroundTileWidth;
    }
    posX = 0;
    posY += backgroundTileHeight;
}
 me.image.src = backgroundContext.canvas.toDataURL("image/jpg");
}


backgroundImage.src = "background/backgroundtile.png";
console.log(backgroundImage);