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

    createCreature: () => {
        let creature = Entity.createEntity();
        //stub in monster name.. should pull from data list? or auto generate from data list?
        creature.name = "Monster";
        creature.id = Math.floor(Math.random() * 1000000);
        // console.log(creature.id);
        return creature;
    }
    
}
    
    
Entity.createCreature();