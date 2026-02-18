// actions.js - Handles movement and tile interactions

export class Actions {
    constructor(world, state, renderer) {
        this.world = world;
        this.state = state;
        this.renderer = renderer;
    }

    move(direction) {
        const pos = this.state.getPosition();
        let newY = pos.y;
        let newX = pos.x;

        // Calculate new position based on direction
        switch (direction) {
            case 'north':
                newY -= 1;
                break;
            case 'south':
                newY += 1;
                break;
            case 'west':
                newX -= 1;
                break;
            case 'east':
                newX += 1;
                break;
            default:
                return;
        }

        // Check if the new position has a tile (not void)
        const tile = this.world.getTile(pos.z, newY, newX);
        if (!tile) {
            // Void tile - cannot move
            return;
        }

        // Move to new position
        this.state.setPosition(pos.z, newY, newX);
        this.state.clearStatusMessage();

        // Handle tile interaction
        this.handleTileInteraction(tile);

        // Auto-save after every move
        this.state.saveToStorage();

        // Re-render the viewport and status
        this.renderer.render();
    }

    handleTileInteraction(tile) {
        const pos = this.state.getPosition();
        const codeInfo = this.world.resolveCode(tile.code);

        if (!codeInfo) return;

        switch (codeInfo.kind) {
            case 'stairs_down':
            case 'stairs_up':
                this.handleStairs(tile);
                break;
            case 'teleport':
                this.handleTeleport(tile);
                break;
            case 'message':
                // Message is displayed in status panel by renderer
                break;
            default:
                // Other tiles (origin, service, encounter, etc.) just display info
                break;
        }
    }

    handleStairs(tile) {
        if (tile.data && tile.data.to) {
            const dest = tile.data.to;
            
            // Check if destination floor is loaded
            const destFloor = this.world.getFloor(dest.z);
            if (!destFloor) {
                this.state.setStatusMessage('No destination.');
                return;
            }

            // Check if destination tile exists
            const destTile = this.world.getTile(dest.z, dest.y, dest.x);
            if (!destTile) {
                this.state.setStatusMessage('No destination.');
                return;
            }

            // Move to destination
            this.state.setPosition(dest.z, dest.y, dest.x);
            this.state.setStatusMessage(`Moved to floor ${dest.z}`);
            
            // Auto-save after floor change
            this.state.saveToStorage();
        } else {
            this.state.setStatusMessage('No destination.');
        }
    }

    handleTeleport(tile) {
        if (!tile.data || !tile.data.linkId) {
            this.state.setStatusMessage('Invalid teleporter.');
            return;
        }

        const pos = this.state.getPosition();
        const dest = this.world.getLinkDestination(pos.z, tile.data.linkId, pos);

        if (!dest) {
            this.state.setStatusMessage('No destination.');
            return;
        }

        // Check if destination tile exists
        const destTile = this.world.getTile(dest.z, dest.y, dest.x);
        if (!destTile) {
            this.state.setStatusMessage('No destination.');
            return;
        }

        // Teleport to destination
        this.state.setPosition(dest.z, dest.y, dest.x);
        this.state.setStatusMessage('Teleported!');
        
        // Auto-save after teleport
        this.state.saveToStorage();
    }
}
