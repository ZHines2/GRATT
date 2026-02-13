# GRATT
narrative geometry

## Coordinate Dungeon Walker v0

A minimal playable dungeon crawler with coordinate-based navigation, inspired by Dungeon Encounters.

### Features
- Grid-based movement using arrow keys or WASD
- Discovery system that reveals tiles as you explore
- 11x11 viewport centered on the player
- Coordinate display in Z . Y . X format
- Link system: teleporters and stairs
- Message tiles and various tile types
- No procedural generation - only authored tiles exist

### How to Run

1. **Start a local web server** in the repository directory:
   - Using Python: `python -m http.server 8000` or `python3 -m http.server 8000`
   - Using Node.js: `npx http-server -p 8000`
   - Using VSCode: Install the "Live Server" extension and click "Go Live"

2. **Open in browser**: Navigate to `http://localhost:8000/src/index.html`

3. **Play**: Use arrow keys or WASD to move around the dungeon

### Controls
- **Arrow Keys** or **WASD**: Move in four cardinal directions
- Movement is blocked by void (non-existent tiles)
- Stepping on special tiles triggers their effects:
  - **Stairs (01/02)**: Move between floors
  - **Teleporters (30)**: Instant travel between linked coordinates
  - **Message tiles (40/41)**: Display text in status panel

### Architecture

The code is organized into separate modules:
- `src/index.html` - HTML layout and styling
- `src/main.js` - Bootstrap and initialization
- `src/engine/world.js` - World data management
- `src/engine/state.js` - Player state and discovery tracking
- `src/engine/render.js` - Viewport and UI rendering
- `src/engine/actions.js` - Movement and tile interactions
- `src/engine/input.js` - Keyboard input handling

### Spec Files
- `spec/laws.md` - Game rules and behavior
- `spec/tilecodes.v0.json` - Tile type definitions
- `spec/floor00.v0.json` - Floor 0 tile layout
