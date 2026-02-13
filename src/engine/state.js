// state.js - Manages player state and discovery

export class State {
    constructor(world) {
        this.world = world;
        this.position = { z: 0, y: 0, x: 0 };
        this.discovered = new Set();
        this.statusMessage = '';
    }

    setPosition(z, y, x) {
        this.position = { z, y, x };
        this.markDiscovered(z, y, x);
    }

    getPosition() {
        return { ...this.position };
    }

    markDiscovered(z, y, x) {
        const key = this.makeKey(z, y, x);
        this.discovered.add(key);
    }

    isDiscovered(z, y, x) {
        const key = this.makeKey(z, y, x);
        return this.discovered.has(key);
    }

    makeKey(z, y, x) {
        return `${z},${y},${x}`;
    }

    setStatusMessage(message) {
        this.statusMessage = message;
    }

    getStatusMessage() {
        return this.statusMessage;
    }

    clearStatusMessage() {
        this.statusMessage = '';
    }

    // Serialize state to JSON
    serialize() {
        return {
            position: this.position,
            discovered: Array.from(this.discovered)
        };
    }

    // Deserialize state from JSON
    deserialize(data) {
        if (data.position) {
            this.position = data.position;
        }
        if (data.discovered) {
            this.discovered = new Set(data.discovered);
        }
    }

    // Save to localStorage
    saveToStorage(key = 'dungeonWalkerSave') {
        try {
            const data = this.serialize();
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
            return false;
        }
    }

    // Load from localStorage
    loadFromStorage(key = 'dungeonWalkerSave') {
        try {
            const json = localStorage.getItem(key);
            if (json) {
                const data = JSON.parse(json);
                this.deserialize(data);
                return true;
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
        }
        return false;
    }

    // Initialize state at start position
    initializeAtStart() {
        const start = this.world.getStartPosition();
        this.setPosition(start.z, start.y, start.x);
    }
}
