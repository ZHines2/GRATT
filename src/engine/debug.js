// debug.js - Debug controls for testing all mechanics

export class DebugControls {
    constructor(world, state, actions, renderer) {
        this.world = world;
        this.state = state;
        this.actions = actions;
        this.renderer = renderer;
        this.isOpen = false;
        this.setupUI();
        this.setupKeyboardShortcut();
    }

    setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            // Toggle debug panel with ` or ~ key
            if (e.key === '`' || e.key === '~') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const panel = document.getElementById('debug-panel');
        if (panel) {
            panel.style.display = this.isOpen ? 'block' : 'none';
        }
    }

    setupUI() {
        const panel = document.getElementById('debug-panel');
        if (!panel) return;

        // Position controls
        document.getElementById('debug-teleport').addEventListener('click', () => {
            const z = parseInt(document.getElementById('debug-z').value) || 0;
            const y = parseInt(document.getElementById('debug-y').value) || 0;
            const x = parseInt(document.getElementById('debug-x').value) || 0;
            this.teleportTo(z, y, x);
        });

        // Quick position buttons
        document.getElementById('debug-origin').addEventListener('click', () => {
            const start = this.world.getStartPosition();
            this.teleportTo(start.z, start.y, start.x);
        });

        document.getElementById('debug-shift-up').addEventListener('click', () => {
            const pos = this.state.getPosition();
            this.teleportTo(pos.z, pos.y - 1, pos.x);
        });

        document.getElementById('debug-shift-down').addEventListener('click', () => {
            const pos = this.state.getPosition();
            this.teleportTo(pos.z, pos.y + 1, pos.x);
        });

        document.getElementById('debug-shift-left').addEventListener('click', () => {
            const pos = this.state.getPosition();
            this.teleportTo(pos.z, pos.y, pos.x - 1);
        });

        document.getElementById('debug-shift-right').addEventListener('click', () => {
            const pos = this.state.getPosition();
            this.teleportTo(pos.z, pos.y, pos.x + 1);
        });

        // Discovery controls
        document.getElementById('debug-reveal-all').addEventListener('click', () => {
            this.revealAll();
        });

        document.getElementById('debug-hide-all').addEventListener('click', () => {
            this.hideAll();
        });

        // Tile spawning
        document.getElementById('debug-spawn-tile').addEventListener('click', () => {
            const code = document.getElementById('debug-tile-code').value;
            this.spawnTile(code);
        });

        // Quick test buttons for all tile types
        this.setupQuickTests();
    }

    setupQuickTests() {
        const testButtons = document.querySelectorAll('[data-test-tile]');
        testButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tileCode = button.getAttribute('data-test-tile');
                const testType = button.getAttribute('data-test-type');
                this.testTile(tileCode, testType);
            });
        });
    }

    teleportTo(z, y, x) {
        // Force teleport to any coordinate
        this.state.setPosition(z, y, x);
        this.state.setStatusMessage(`Debug: Teleported to ${z} . ${y} . ${x}`);
        this.renderer.render();
        console.log(`Debug: Teleported to ${z},${y},${x}`);
    }

    revealAll() {
        const floor = this.world.getFloor(this.state.getPosition().z);
        if (!floor) return;

        Object.keys(floor.tiles).forEach(key => {
            const [y, x] = key.split(',').map(Number);
            this.state.markDiscovered(this.state.getPosition().z, y, x);
        });

        this.state.setStatusMessage('Debug: Revealed all tiles on current floor');
        this.renderer.render();
        console.log('Debug: Revealed all tiles');
    }

    hideAll() {
        this.state.discovered.clear();
        const pos = this.state.getPosition();
        this.state.markDiscovered(pos.z, pos.y, pos.x);
        this.state.setStatusMessage('Debug: Reset discovery');
        this.renderer.render();
        console.log('Debug: Reset discovery');
    }

    spawnTile(code) {
        const pos = this.state.getPosition();
        const floor = this.world.getFloor(pos.z);
        
        if (!floor) {
            console.error('Debug: No floor loaded');
            return;
        }

        const key = `${pos.y},${pos.x}`;
        floor.tiles[key] = { code: code };
        
        this.state.setStatusMessage(`Debug: Spawned tile ${code} at current position`);
        this.renderer.render();
        console.log(`Debug: Spawned tile ${code} at ${pos.z},${pos.y},${pos.x}`);
    }

    testTile(tileCode, testType) {
        const pos = this.state.getPosition();
        const codeInfo = this.world.resolveCode(tileCode);
        
        console.log(`Debug: Testing ${tileCode} - ${codeInfo ? codeInfo.label : 'Unknown'}`);
        
        switch (testType) {
            case 'stairs':
                // Create stairs with test destination
                this.spawnTileWithData(tileCode, {
                    to: { z: pos.z, y: pos.y + 5, x: pos.x + 5 }
                });
                break;
            case 'teleport':
                // Create teleporter with test link
                this.createTestTeleporter();
                break;
            case 'message':
                // Create message tile
                this.spawnTileWithData(tileCode, {
                    text: `Test message for ${codeInfo.label}`
                });
                break;
            default:
                // Just spawn the tile
                this.spawnTile(tileCode);
        }

        this.state.setStatusMessage(`Debug: Testing ${codeInfo ? codeInfo.label : tileCode}`);
        this.renderer.render();
    }

    spawnTileWithData(code, data) {
        const pos = this.state.getPosition();
        const floor = this.world.getFloor(pos.z);
        
        if (!floor) return;

        const key = `${pos.y},${pos.x}`;
        floor.tiles[key] = { code: code, data: data };
        
        console.log(`Debug: Spawned tile ${code} with data:`, data);
    }

    createTestTeleporter() {
        const pos = this.state.getPosition();
        const floor = this.world.getFloor(pos.z);
        
        if (!floor) return;

        // Create two linked teleporters
        const linkId = 'debug-link-' + Date.now();
        
        // Current position
        const key1 = `${pos.y},${pos.x}`;
        floor.tiles[key1] = { code: '30', data: { linkId: linkId } };
        
        // Destination position (5 tiles away)
        const key2 = `${pos.y + 5},${pos.x + 5}`;
        floor.tiles[key2] = { code: '30', data: { linkId: linkId } };
        
        // Add link to floor
        if (!floor.links) floor.links = {};
        floor.links[linkId] = [
            { z: pos.z, y: pos.y, x: pos.x },
            { z: pos.z, y: pos.y + 5, x: pos.x + 5 }
        ];

        console.log(`Debug: Created linked teleporters at ${pos.y},${pos.x} and ${pos.y + 5},${pos.x + 5}`);
    }

    getStatus() {
        const pos = this.state.getPosition();
        const tile = this.world.getTile(pos.z, pos.y, pos.x);
        const discovered = this.state.discovered.size;
        
        return {
            position: pos,
            tile: tile,
            discovered: discovered,
            isOpen: this.isOpen
        };
    }
}
