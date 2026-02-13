// world.js - Loads and manages floor data and tile codes

export class World {
    constructor() {
        this.tileCodes = null;
        this.floors = new Map();
    }

    async loadTileCodes(path = '/spec/tilecodes.v0.json') {
        const response = await fetch(path);
        const data = await response.json();
        this.tileCodes = data.codes;
        return this.tileCodes;
    }

    async loadFloor(z, path = `/spec/floor${String(z).padStart(2, '0')}.v0.json`) {
        const response = await fetch(path);
        const data = await response.json();
        this.floors.set(z, data);
        return data;
    }

    getFloor(z) {
        return this.floors.get(z);
    }

    getTile(z, y, x) {
        const floor = this.floors.get(z);
        if (!floor) return null;
        
        const key = `${y},${x}`;
        return floor.tiles[key] || null;
    }

    resolveCode(code) {
        if (!this.tileCodes) return null;
        return this.tileCodes[code] || null;
    }

    getStartPosition() {
        // Get start position from floor 0
        const floor = this.floors.get(0);
        return floor ? floor.start : { z: 0, y: 0, x: 0 };
    }

    getLinks(z) {
        const floor = this.floors.get(z);
        return floor ? floor.links : {};
    }

    getLinkDestination(z, linkId, currentPos) {
        const links = this.getLinks(z);
        if (!links[linkId]) return null;

        const linkPair = links[linkId];
        if (!Array.isArray(linkPair) || linkPair.length !== 2) return null;

        // Find the destination (the coordinate that is NOT the current position)
        const [coord1, coord2] = linkPair;
        
        if (coord1.z === currentPos.z && coord1.y === currentPos.y && coord1.x === currentPos.x) {
            return coord2;
        } else if (coord2.z === currentPos.z && coord2.y === currentPos.y && coord2.x === currentPos.x) {
            return coord1;
        }

        // If current position doesn't match either, return the first one
        return coord1;
    }

    static makeKey(z, y, x) {
        return `${z},${y},${x}`;
    }

    static parseKey(key) {
        const parts = key.split(',').map(Number);
        return { z: parts[0], y: parts[1], x: parts[2] };
    }
}
