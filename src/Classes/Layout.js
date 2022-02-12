export default {
    
    dragElements: () => {
        let elements = document.querySelectorAll("[draggable]");
        
        for (let element of elements) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            if (document.getElementById(element.id + "header")) {
                // if present, the header is where you move the DIV from:
                document.getElementById(element.id + "header").onmousedown = dragMouseDown;
            } else {
                // otherwise, move the DIV from anywhere inside the DIV:
                element.addEventListener('mousedown', (event) => {
                    dragMouseDown(event);
                });
            }
            
            function dragMouseDown(event) {
                if (!window.editLayout) return;
                elements.forEach(element => {
                    element.classList.remove('active');
                });
                element.classList.add('active');
                element.style.zIndex++;
                event = event || window.event;
                event.preventDefault();
                // get the mouse cursor position at startup:
                pos3 = event.clientX;
                pos4 = event.clientY;
                // call a function whenever the cursor moves:
                
                document.addEventListener('mouseup', closeDragElement);
                document.addEventListener('mousemove', elementDrag);
            }
            
            function elementDrag(event) {
                event = event || window.event;
                event.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - event.clientX;
                pos2 = pos4 - event.clientY;
                pos3 = event.clientX;
                pos4 = event.clientY;
                // set the element's new position:

                // setup max and min top left
                let top = element.offsetTop - pos2;
                let left = element.offsetLeft - pos1;
                let right = left + element.offsetWidth;
                let bottom = top + element.offsetHeight;
                if (top < 0) top = 0;
                if (left < 0) left = 0;
                if (right > window.innerWidth) left = window.innerWidth - element.offsetWidth;
                if (bottom > window.innerHeight) top = window.innerHeight - element.offsetHeight;
                element.style.top = top + "px";
                element.style.left = left + "px";
            }
            
            function closeDragElement() {
                // stop moving when mouse button is released:
                document.removeEventListener('mousemove', elementDrag);
                document.removeEventListener('mouseup', closeDragElement);

                // save element in new position in windows state manager

            }
        }
    }
}