import { MainMenuScene } from './scene/MainMenuScene.js';
import { CONTROL_BUTTONS, CANVA_WIDTH, CANVA_HEIGHT, GRAVITY } from './Config.js'


const CONFIG = {
    type: Phaser.AUTO,
    width: CANVA_WIDTH,
    height: CANVA_HEIGHT,
    parent: 'gameContainer',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GRAVITY },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.NONE,
        width: CANVA_WIDTH,
        height: CANVA_HEIGHT,
    },
    scene: [MainMenuScene]
};

const GAME = new Phaser.Game(CONFIG);

let keys;

export function activeControls(scene) {
    keys = scene.input.keyboard.addKeys({
        'left': Phaser.Input.Keyboard.KeyCodes.A,
        'right': Phaser.Input.Keyboard.KeyCodes.D,
        'up': Phaser.Input.Keyboard.KeyCodes.W,
        'down': Phaser.Input.Keyboard.KeyCodes.S,
        'space': Phaser.Input.Keyboard.KeyCodes.SPACE,
        'esc': Phaser.Input.Keyboard.KeyCodes.ESC,
    });

    for (let [direction, btn] of Object.entries(CONTROL_BUTTONS)) {
        switch (scene) {
            case 'MainMenuScene':
                if (direction == 'b')
                    direction = 'space'
                if (direction == 'a')
                    direction = 'esc'
                break;
            case 'Level':
                if (direction == 'b' || direction == 'a')
                    direction = 'up'
                break;
            case 'GamePausedScene':
                if (direction == 'b')
                    direction = 'space'
                if (direction == 'a')
                    direction = 'esc'
                break;
            case 'GameOverScene':
                if (direction == 'b')
                    direction = 'space'
                break;

            default:
                break;
        }

        if (direction == 'b') {
            direction = 'space';
        }
        if (direction == 'a') {
            direction = 'esc';
        }
        addControlListeners(btn, direction);
    }

    function addControlListeners(btn, direction) {
        let handleStart = () => {
            window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: keys[direction].keyCode }));
        };

        let handleEnd = () => {
            window.dispatchEvent(new KeyboardEvent('keyup', { keyCode: keys[direction].keyCode }));
        };

        btn.addEventListener('touchstart', handleStart);
        btn.addEventListener('touchend', handleEnd);
        btn.addEventListener('mousedown', handleStart);
        btn.addEventListener('mouseup', handleEnd);

    }
    return scene.input.keyboard;
}

