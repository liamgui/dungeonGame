export interface Manager {

}

// export interface GameManager extends Manager {
//     Managers: Managers;
//     MapRenderer: 
// }


export interface LayoutManager extends Manager {

}



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
    MapRenderer: any;
    PlayerManager: any;
    MapManager: any;
}
