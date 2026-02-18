# GRATT
narrative geometry

## Coordinate Dungeon Walker v0

A minimal playable dungeon crawler with coordinate-based navigation, inspired by Dungeon Encounters.

**Play Online:** [https://zhines2.github.io/GRATT/](https://zhines2.github.io/GRATT/)

---

### Current State of Play

**Version:** v0 — Traversal Engine

All 6 core tasks from the v0 spec are implemented and functional:

| Task | Status | Description |
|------|--------|-------------|
| 1 — Load Specs | ✅ | JSON parsing, `getTile(z,y,x)`, `resolveCode(code)` |
| 2 — Coordinate Walker | ✅ | Arrow/WASD movement, void blocking, position display |
| 3 — Discovery | ✅ | Set-based tile tracking, session persistence |
| 4 — Minimal Renderer | ✅ | 11×11 viewport centered on player |
| 5 — Link Resolution | ✅ | Bidirectional teleporters + async stair transitions |
| 6 — Status Panel | ✅ | Position, tile code, kind/label, message text |

**Bonus features beyond spec:**
- Auto-save to `localStorage` after every move
- Save restoration on page reload (including cross-floor position)
- Per-floor color theming (each floor has distinct discovered/undiscovered colors)
- Silent tile system (`71` Open Door tiles hide their code on the grid)
- Dynamic floor loading (floors load on-demand when stairs are used)
- GitHub Pages deployment at repository root

**World data:** 4 authored floors with stairs chaining them together and one teleporter link per floor. Map layouts are placeholder — they will be redesigned once the engine is finalized.

**Tile codes in use:**

| Code | Kind | Label | Functional |
|------|------|-------|------------|
| `00` | origin | Origin | ✅ Starting point |
| `01` | stairs_down | Stairs Down | ✅ Async floor transition |
| `02` | stairs_up | Stairs Up | ✅ Async floor transition |
| `30` | teleport | Teleporter | ✅ Bidirectional link |
| `40` | message | Sign | ✅ Displays text |
| `41` | message | Note | ✅ Displays text |
| `71` | door | Open Door | ✅ Silent passable tile |
| `ff` | void | Void | Defined but unused (void = absent tile) |

**Not implemented (by design in v0):**
- Combat, encounters, XP, leveling
- Inventory, shops, inns, chests, traps
- Service tile menus (21–29)
- Encounter tile behavior (50–5F)
- Procedural generation of any kind

---

### How to Play

**Play Online:** Visit the [GitHub Pages site](https://zhines2.github.io/GRATT/) to play immediately in your browser.

**Local Development:**

1. **Start a local web server** in the repository directory:
   - Using Python: `python -m http.server 8000` or `python3 -m http.server 8000`
   - Using Node.js: `npx http-server -p 8000`
   - Using VSCode: Install the "Live Server" extension and click "Go Live"

2. **Open in browser**: Navigate to `http://localhost:8000/`

3. **Play**: Use arrow keys or WASD to move around the dungeon

### Controls
- **Arrow Keys** or **WASD**: Move in four cardinal directions
- **` (backtick)**: Toggle debug panel
- Movement is blocked by void (non-existent tiles)
- Stepping on special tiles triggers their effects:
  - **Stairs (01/02)**: Move between floors
  - **Teleporters (30)**: Instant travel between linked coordinates
  - **Message tiles (40/41)**: Display text in status panel

### Debug Mode

Press **`** (backtick key) to open the debug panel. This powerful testing tool allows you to:

**Position Controls:**
- Teleport to any coordinate (z, y, x)
- Jump to origin instantly
- Shift position one tile at a time (North/South/East/West)

**Discovery Controls:**
- Reveal all tiles on the current floor
- Reset discovery state

**Tile Spawner:**
- Place any tile code at your current position
- Test custom layouts without editing JSON files

**Quick Test Buttons (v0 Traversal Only):**
- Test navigation mechanics: stairs down (01), stairs up (02), teleporter (30)
- Test message tiles: sign (40), note (41)

The debug interface automatically creates linked teleporters and functional stairs for testing. All debug actions are logged to the console for verification.

**Console Access:**
```javascript
window.debugControls  // Access debug methods programmatically
window.game          // Access game objects (world, state, actions, renderer)
``` 

### Architecture

The code is organized into separate modules:
- `index.html` - Root HTML entry point for GitHub Pages
- `src/index.html` - HTML layout and styling (development)
- `src/main.js` - Bootstrap and initialization
- `src/engine/world.js` - World data management and floor loading
- `src/engine/state.js` - Player state, discovery tracking, and save/load
- `src/engine/render.js` - Viewport and UI rendering with floor theming
- `src/engine/actions.js` - Movement, stairs (async), and teleport handling
- `src/engine/input.js` - Keyboard input handling
- `src/engine/debug.js` - Debug controls and testing tools

### Spec Files
- `spec/laws.md` - Game rules and behavior
- `spec/tilecodes.v0.json` - Tile type definitions
- `spec/floor00.v0.json` - Floor 0 layout
- `spec/floor01.v0.json` - Floor 1 layout
- `spec/floor02.v0.json` - Floor 2 layout
- `spec/floor03.v0.json` - Floor 3 layout

### Docs
- `docs/copilot_tasks.md` - v0 task list and acceptance criteria
