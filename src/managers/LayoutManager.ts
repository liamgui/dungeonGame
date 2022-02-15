import { GameManager } from "~/managers/GameManager";

// rework this for event delegation on document.mousedown/document.mousemove/document.mouseup
// a document.addEventListener() should be added on intialization of class or on toggle?
export class LayoutManager {
    draggables: NodeListOf<HTMLElement>;
    activeElement: HTMLElement;
    mouseMove: any;
    editLayoutMode: boolean = true; 
    
    pos = {
        pos1: 0,
        pos2: 0,
        pos3: 0,
        pos4: 0
    }
    
    constructor(private GameManager?: GameManager) {
        this.draggables = document.querySelectorAll("[draggable]");
        document.addEventListener('mousedown', (e) => {
            this.dragMouseDown(e)
        });
        // this.dragElements();

    }
    init() {
        console.log("Init");
        //get all draggable this.draggables
    }

    detectCollision(element, targets) {
        if (!targets.length) {
            return;
        }
        //detect collision
        // check if element's left, right, top, bottom overlap any of the target's left, right, top, bottom
        for (let target of targets) {
            if (target.offsetTop < this.activeElement.offsetTop + this.activeElement.offsetHeight &&
                target.offsetTop + target.offsetHeight > this.activeElement.offsetTop &&
                target.offsetLeft < this.activeElement.offsetLeft + this.activeElement.offsetWidth &&
                target.offsetLeft + target.offsetWidth > this.activeElement.offsetLeft) {
                console.log("collision");
                return true;
            }
        }
    }

    // dragElements() {
    //     // for (let element of this.draggables) {
    //     //     if (document.getElementById(this.activeElement.id + "header")) {
    //     //         // if present, the header is where you move the DIV from:
    //     //         document.getElementById(this.activeElement.id + "header").onmousedown = this.dragMouseDown;
    //     //     } else {
    //     //         // otherwise, move the DIV from anywhere inside the DIV:
    //     //         // this.activeElement.addEventListener('mousedown', this.dragMouseDown);
    //     //     }
    //     // }
    // }
    
    dragMouseDown(event) {
        console.log(event.target);
        console.log(event.target in Object.values(this.draggables));
        if (!(Object.values(this.draggables).filter((element) => element == event.target).length)) return;
        console.log("test");
        this.activeElement = event.target;
        this.pos.pos1 = 0;
        this.pos.pos2 = 0;
        this.pos.pos3 = 0;
        this.pos.pos4 = 0;

        if (this.editLayoutMode) return;
        this.draggables.forEach(element => {
            element.classList.remove('active');
        });
        this.activeElement.classList.add('active');
        this.activeElement.style.zIndex = (parseInt(this.activeElement.style.zIndex) + 1).toString();
        event = event || window.event;
        event.preventDefault();
        // get the mouse cursor position at startup:
        this.pos.pos3 = event.clientX;
        this.pos.pos4 = event.clientY;
        // call a function whenever the cursor moves:
        this.mouseMove = function() {
            this.elementDrag(event, this.activeElement);
        }
        document.addEventListener('mouseup', this.closeDragElement);
        document.addEventListener('mousemove', this.mouseMove);
    }

    
    elementDrag(event, element) {
        event = event || window.event;
        event.preventDefault();
        // calculate the new cursor position:
        this.pos.pos1 = this.pos.pos3 - event.clientX;
        this.pos.pos2 = this.pos.pos4 - event.clientY;
        this.pos.pos3 = event.clientX;
        this.pos.pos4 = event.clientY;
        // set the element's new position:

        // setup max and min top left
        let top = this.activeElement.offsetTop - this.pos.pos2;
        let left = this.activeElement.offsetLeft - this.pos.pos1;
        let right = left + this.activeElement.offsetWidth;
        let bottom = top + this.activeElement.offsetHeight;
        if (top < 0) top = 0;
        if (left < 0) left = 0;
        if (right > window.innerWidth) left = window.innerWidth - this.activeElement.offsetWidth;
        if (bottom > window.innerHeight) top = window.innerHeight - this.activeElement.offsetHeight;
        this.activeElement.style.top = top + "px";
        this.activeElement.style.left = left + "px";
    }

    closeDragElement() {
        this.detectCollision(this.activeElement, document.querySelectorAll("[draggable]"));
        // stop moving when mouse button is released:
        document.removeEventListener('mousemove', this.mouseMove);
        document.removeEventListener('mouseup', this.closeDragElement);

        // save element in new position in windows state manager
    }
}