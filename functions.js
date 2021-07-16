Math.seedRandom = function(max, min) {
    
    if (Global.seed === undefined /* | typeof Global.seed === 'string' */) {
        Global.seed = Math.floor(Math.random() * 1000);
    }
    
    if (typeof Global.seed === 'string') {
        let seed = 1; 
        for (let c in Global.seed){
            seed = seed * Global.seed.charCodeAt(c);
        };
        Global.seed = seed;
    }
    max = max || 1;
    min = min || 0;
    Global.seed = (Global.seed * 9301 + 49297) % 233280;
    // console.log(Math.seed);
    // console.log(Math.seed);
    var rnd = Global.seed / 233280;
    return min + rnd * (max - min);
};

var getIndexOfK = function (arr, k) {
    for (var i = 0; i < arr.length; i++) {
        var index = arr[i].indexOf(k);
        if (index > -1) {
            return [i, index];
        }
    }
}

dragElement(document.querySelector(".mapContainer"));

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }
    
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}