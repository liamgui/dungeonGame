import { PlayerManager } from '~/managers/PlayerManager';
import { CommandManager } from '~/managers/CommandManager';
import { LayoutManager } from '~/managers/LayoutManager';
import { MapRenderer } from '~/managers/map/MapRenderer';
import { MapManager } from '~/managers/map/MapManager';
export interface Manager {

}

// export interface GameManager extends Manager {
//     Managers: Managers;
//     MapRenderer: 
// }



declare global {
    interface Window {
        Global: any;
        // game: any;
        // chunkCount: number;
        // chunkSize: number;
        // tileSize: number;
        // tileCount: number;
        // zoomLevel: number;
        // currentChunk: number[];
        // playerPosition: number[];
        // playerDirection: string;
        // revealAll: boolean;
        // clipping: boolean;
        // seed: string;
    }
	interface Math {
		seedRandom: any
	}
}


export interface Managers {
    LayoutManager: LayoutManager;
    MapRenderer: MapRenderer;
    PlayerManager: PlayerManager;
    MapManager: MapManager;
    CommandManager: CommandManager;
}
