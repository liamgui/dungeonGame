// import Entity from './Entity.js';

let Entity = {



// export default {
    createEntity: () => {
        let entity = {
            name: null,
            id: null
        }
        return entity;
    },

    createMonster: () => {
        let monster = Entity.createEntity();
        //stub in monster name.. should pull from data list? or auto generate from data list?
        monster.name = "Monster";
        monster.id = Math.floor(Math.random() * 1000000);
        console.log(monster.id);
        return monster;
    }
    
}
    
    
Entity.createMonster();