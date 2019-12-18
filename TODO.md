-----------------------------
## -- OverAll --
-----------------------------

[ ] Player "Entity" Class?
[√] Player position (Global
[√] Player movement

[x] DONE chunk loading/creation when within 7 tiles of edge if chunk is not already created? (2 chunks out?)
[√] DONE chunk loading/creation when entering new chunk (perimeter checking for chunks, then generating)

    Thoughts:



------------------------
## -- Chunk Rendering --
------------------------


    chunk rendering based on parents location on window
    chunk rendering order and positions based on previous ^
    fix function to be called when moving player (really just move the entire rendered map by one tile in direction the player is facing.)
    cleanup conditionals??

- change to multiple canvas elements?

  Thoughts:

---

------------------------
## -- Chunk Generating --
------------------------

[√] fix edges according to next chunk
[ ] store map in localstorage?

    Thoughts:

- Room list
  [ ] In generating chunks, create room list that recursively checks each tile
  //if tile already has roomId in it, then skip,
  //else check right(east) and bottom(south) for open walls,
  //generate new roomId,
  //add corresponding tile with open wall to roomId
  //proceed to check that tiles perimeter (minus the previous tile)
  //recursive
  //move to next tile

---

------------------------
## -- Player Movement --
------------------------
=======
    Bug:
[ ] Adding null multiple times per row in ChunkGrid


[√] hold down forward to go consecutively
[ ]

---

------------------------
## ------ Cleanup -------
------------------------


Use tile getters
create tile setters
use chunkId getters

cleanup player.js
move some stuff to functions in player.js


-----------------------------------------------
## ------ Global Tile Grid Positioning -------
------------------------------------------------

Create Global Tile Grid just for referencing in case of future pathfinding quests
