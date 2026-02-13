# Copilot Task List (v0)

## Rules
- Do NOT add proc-gen.
- Do NOT invent combat, XP, inventory, or UI systems not listed here.
- Follow spec in `spec/laws.md`, `spec/tilecodes.v0.json`, `spec/floor00.v0.json`.

---

## Task 1 — Load Specs
**Goal:** Load `tilecodes.v0.json` and `floor00.v0.json`.

**Acceptance:**
- Parse JSON successfully.
- Provide `getTile(z,y,x)` that returns tile or null.
- Provide `resolveCode(code)` that returns the entry from tilecodes table.

---

## Task 2 — Coordinate Walker
**Goal:** Move the player with arrow keys.

**Acceptance:**
- Start at floor.start.
- Arrow keys move by 1 tile (N/S/E/W).
- If destination tile is null → do nothing.
- Display current `Z . Y . X`.

---

## Task 3 — Discovery
**Goal:** Track discovered tiles.

**Acceptance:**
- Entering a tile marks it discovered.
- Maintain `discovered` as a Set of "z,y,x" keys.
- Render unknown tiles differently from discovered tiles.

---

## Task 4 — Minimal Renderer
**Goal:** Show a small viewport around player.

**Acceptance:**
- Render an 11x11 window centered on player.
- If tile is void: show blank/void.
- If tile is undiscovered: show `?`
- If discovered:
  - show `@` for player
  - show tile code (or a symbol) for the tile

---

## Task 5 — Link Resolution (Teleporter + Stairs)
**Goal:** Support `30` teleporter and `01/02` stairs.

**Acceptance:**
- Teleporter: moving onto a `30` tile uses floor.links[linkId] to move to the paired coordinate.
- Stairs: stepping onto `01` uses tile.data.to and moves player.
- Movement after link is immediate and updates discovery.

---

## Task 6 — Status Panel
**Goal:** Display "tile meaning".

**Acceptance:**
- Show: `code`, `kind`, `label`
- If message tile (40/41), show its `data.text`.