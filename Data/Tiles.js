export default {    
    tileTypes: {
        solidRoom: {
            background: '#444444',
            border: 'thin solid black',
        },
        unexplored: {
            getImg: function() {
                this.img = new Image();
                this.img.src = '../tileSets/unexplored.png';
                return this.img;
            },
            background: '#444444',
            border: 'none',
        },
        door: {

        },
        passage: {

        },
    }
}