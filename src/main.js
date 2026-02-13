// main.js - Bootstrap and initialization
// 
// HOW TO RUN:
// 1. Make sure you have a local web server running (e.g., VSCode Live Server)
// 2. Open src/index.html in your browser via the local server
// 3. The game will load automatically
// 4. Use Arrow Keys or WASD to move around the dungeon

import { World } from './engine/world.js';
import { State } from './engine/state.js';
import { Renderer } from './engine/render.js';
import { Actions } from './engine/actions.js';
import { InputHandler } from './engine/input.js';
import { DebugControls } from './engine/debug.js';

async function init() {
    try {
        // Create world and load data
        const world = new World();
        await world.loadTileCodes();
        await world.loadFloor(0);

        // Create state and initialize at start position
        const state = new State(world);
        state.initializeAtStart();

        // Create renderer
        const renderer = new Renderer(world, state);

        // Create actions handler
        const actions = new Actions(world, state, renderer);

        // Set up input handling
        new InputHandler((direction) => {
            actions.move(direction);
        });

        // Initialize debug controls
        const debugControls = new DebugControls(world, state, actions, renderer);
        
        // Expose to window for console access
        window.debugControls = debugControls;
        window.game = { world, state, actions, renderer };

        // Initial render
        renderer.show();
        renderer.render();

        console.log('Coordinate Dungeon Walker v0 initialized successfully');
        console.log('Press ` to open debug panel');
        console.log('Debug controls available at: window.debugControls');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        const container = document.getElementById('game-container');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = `Failed to load game: ${error.message}`;
        container.insertBefore(errorDiv, container.firstChild);
    }
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
