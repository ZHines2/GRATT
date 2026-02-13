// input.js - Keyboard input handler

export class InputHandler {
    constructor(onMove) {
        this.onMove = onMove;
        this.setupKeyboardHandling();
    }

    setupKeyboardHandling() {
        document.addEventListener('keydown', (e) => {
            // Prevent default browser behavior for arrow keys and WASD
            if (this.isGameKey(e.key)) {
                e.preventDefault();
            }

            const direction = this.getDirection(e.key);
            if (direction && this.onMove) {
                this.onMove(direction);
            }
        });
    }

    isGameKey(key) {
        const gameKeys = [
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
            'w', 'a', 's', 'd',
            'W', 'A', 'S', 'D'
        ];
        return gameKeys.includes(key);
    }

    getDirection(key) {
        const keyMap = {
            'ArrowUp': 'north',
            'ArrowDown': 'south',
            'ArrowLeft': 'west',
            'ArrowRight': 'east',
            'w': 'north',
            'W': 'north',
            's': 'south',
            'S': 'south',
            'a': 'west',
            'A': 'west',
            'd': 'east',
            'D': 'east'
        };
        return keyMap[key] || null;
    }
}
