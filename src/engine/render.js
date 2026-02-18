// render.js - Renders the viewport and status panel

export class Renderer {
    constructor(world, state) {
        this.world = world;
        this.state = state;
        this.viewportElement = document.getElementById('viewport');
        this.statusPanelElement = document.getElementById('status-panel');
    }

    render() {
        this.renderViewport();
        this.renderStatus();
    }

    renderViewport() {
        const pos = this.state.getPosition();
        const viewportSize = 11;
        const halfSize = Math.floor(viewportSize / 2);

        // Clear viewport
        this.viewportElement.innerHTML = '';

        // Render 11x11 grid centered on player
        for (let dy = -halfSize; dy <= halfSize; dy++) {
            for (let dx = -halfSize; dx <= halfSize; dx++) {
                const y = pos.y + dy;
                const x = pos.x + dx;
                const z = pos.z;

                const cell = document.createElement('div');
                cell.className = 'cell';

                // Add floor-based color class
                cell.classList.add(`floor-${z}`);

                // Check if this is the player position
                const isPlayer = (dy === 0 && dx === 0);

                if (isPlayer) {
                    cell.classList.add('player');
                    cell.textContent = '@';
                } else {
                    const tile = this.world.getTile(z, y, x);
                    const discovered = this.state.isDiscovered(z, y, x);
                    const codeInfo = tile ? this.world.resolveCode(tile.code) : null;
                    const isSilent = codeInfo?.silent === true;

                    if (!tile) {
                        // Void tile
                        cell.classList.add('void');
                        cell.textContent = ' ';
                    } else if (!discovered) {
                        // Undiscovered tile
                        cell.classList.add('undiscovered');
                        cell.textContent = '';  // All undiscovered tiles show nothing (cleaner, no hints)
                    } else {
                        // Discovered tile
                        cell.classList.add('discovered');
                        if (isSilent) {
                            cell.textContent = '';  // Silent tiles never show code
                        } else {
                            cell.textContent = tile.code;  // Important tiles show their code
                        }
                    }
                }

                this.viewportElement.appendChild(cell);
            }
        }
    }

    renderStatus() {
        const pos = this.state.getPosition();
        const tile = this.world.getTile(pos.z, pos.y, pos.x);
        const codeInfo = tile ? this.world.resolveCode(tile.code) : null;

        // Update position display
        const posDisplay = document.getElementById('position-display');
        posDisplay.textContent = this.formatPosition(pos.z, pos.y, pos.x);

        // Update tile code display
        const codeDisplay = document.getElementById('tile-code-display');
        codeDisplay.textContent = tile ? tile.code : '--';

        // Update tile type display
        const typeDisplay = document.getElementById('tile-type-display');
        if (codeInfo) {
            typeDisplay.textContent = `${codeInfo.label} (${codeInfo.kind})`;
        } else {
            typeDisplay.textContent = '--';
        }

        // Update message container
        const messageContainer = document.getElementById('message-container');
        const statusMsg = this.state.getStatusMessage();

        if (statusMsg) {
            messageContainer.innerHTML = `<div class="message-text">${this.escapeHtml(statusMsg)}</div>`;
        } else if (tile && tile.data && tile.data.text) {
            // Display message tile text
            messageContainer.innerHTML = `<div class="message-text">${this.escapeHtml(tile.data.text)}</div>`;
        } else {
            messageContainer.innerHTML = '';
        }
    }

    formatPosition(z, y, x) {
        const zStr = String(z).padStart(2, '0');
        const yStr = String(y).padStart(2, '0');
        const xStr = String(x).padStart(2, '0');
        return `${zStr} . ${yStr} . ${xStr}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    show() {
        document.getElementById('loading').style.display = 'none';
        this.viewportElement.style.display = 'grid';
        this.statusPanelElement.style.display = 'block';
    }

    showError(message) {
        const container = document.getElementById('game-container');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = `Error: ${message}`;
        container.insertBefore(errorDiv, container.firstChild);
    }
}
