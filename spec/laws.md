# Coordinate Dungeon Walker - Laws (v0)

## Core Laws

### 1. Grid & Coordinate System
- The world is a discrete 3D grid indexed by (z, y, x)
- z = floor/depth, y = north/south, x = east/west
- Only tiles explicitly defined in floor JSON files exist
- Missing tiles are void and impassable
- Coordinates are displayed as "ZZ . YY . XX" (e.g., "00 . 50 . 50")

### 2. Movement
- Player moves one tile at a time using arrow keys or WASD
- Movement is restricted to the four cardinal directions (N/S/E/W)
- Movement to void tiles is blocked (position does not change)
- Movement to authored tiles succeeds (position updates)

### 3. Discovery
- Tiles are initially undiscovered
- Entering a tile marks it as discovered
- Discovered status persists for the session
- Undiscovered tiles render as "?"
- Discovered tiles render as their 2-digit hex code

### 4. Tile Codes & Interactions
- Each tile has a code (2-digit hex) that determines its behavior
- Tile codes are defined in tilecodes.v0.json
- Stepping onto a tile triggers its code-specific behavior

#### Service Tiles (00, 21-29)
- Origin point (00): Starting location, no special action
- Service tiles (21-29): Show label/kind in status panel, no menu in v0

#### Stairs (01, 02)
- Stairs down (01): Move to tile.data.to if present, else show "No destination"
- Stairs up (02): Move to tile.data.to if present, else show "No destination"
- Discovery updates after stair transition

#### Teleporter (30)
- Uses tile.data.linkId to reference floor.links table
- Links are two-way (bidirectional)
- Moving to destination updates discovery
- Invalid linkId shows "No destination" or error message

#### Message Tiles (40, 41)
- Display tile.data.text in status panel
- No other interaction required in v0

#### Encounter Tiles (50-5F)
- Display in grid but do not trigger combat (no combat in v0)
- Show label/kind in status panel

### 5. Rendering
- Display an 11x11 viewport centered on player
- Player position shown as "@" (overlay on current tile)
- Void tiles: blank or " "
- Undiscovered tiles: "?"
- Discovered tiles: 2-digit hex code

### 6. Status Panel
- Current position: "ZZ . YY . XX"
- Current tile code
- Current tile kind and label
- Message text (for message tiles)

### 7. Data Format
- Floor tiles are keyed as "y,x" strings in JSON
- Each tile object contains: code, data (optional)
- tile.data may contain: to (coordinates), linkId, text, etc.
- Coordinates in data are objects: {z, y, x}

### 8. No Procedural Generation
- Only explicitly authored tiles exist
- No random generation of tiles, layouts, or content
- "Spec is truth" - behavior follows spec files exactly

### 9. Minimal Features (v0)
- NO combat system
- NO XP or leveling
- NO inventory system
- NO complex UI menus
- Focus: movement, discovery, links, basic status display
