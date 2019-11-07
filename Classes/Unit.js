export default {
    
    function Unit(x, y) {
        this.x = x;
        this.y = y;
        this.draw = function() {
            gameCtx.beginPath();
            gameCtx.arc(x, y, 7.5, Math.PI * 2, false);
            gameCtx.fillStyle = "gray";
            gameCtx.fill();
            gameCtx.strokeStyle = "#cccccc";
            gameCtx.stroke();
        };
    }

}
