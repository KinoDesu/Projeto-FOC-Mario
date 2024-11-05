//#region game sprite configs
export const BLOCK_SIZE = 32;
export const CANVA_WIDTH = BLOCK_SIZE * 16;
export const CANVA_HEIGHT = BLOCK_SIZE * 16;
export const SPIKE_HEIGHT = 16;
export const SPIKE_WIDTH = BLOCK_SIZE;

export const WORLD_WIDTH = BLOCK_SIZE * 1000;
//#endregion

//#region player config
export const PLAYER_SIZE = BLOCK_SIZE;
//#endregion

//#region fisics config
export const GRAVITY = 400;
export const JUMP_HEIGHT = PLAYER_SIZE * 3.25;
export const ENEMY_RIGHT = 100;
export const ENEMY_LEFT = -100;
//#endregion

var pausedGame = false;

export function setPausedgame(status) {
    pausedGame = status;
}

export function getPausedgame() {
    return pausedGame;
}


export var DEV_MODE = false;

export const CONTROL_BUTTONS = {
    up: document.querySelector(".up"),
    down: document.querySelector(".down"),
    a: document.querySelector(".a"),
    b: document.querySelector(".b"),
    right: document.querySelector(".right"),
    left: document.querySelector(".left"),
    esc: document.querySelector(".start")
};

export function dieAnim(scene) {
    scene.player.setTint(0xff0000);


    scene.player.setVelocityX(0);
    scene.player.setVelocity(0);
    scene.player.body.setAllowGravity(false);
    scene.player.setCollideWorldBounds(false)

    let upwardVelocity = -300;
    scene.player.setVelocityY(upwardVelocity);

    scene.colliders.get("player").forEach((collider) => {
        collider.destroy();
    });

    scene.time.delayedCall(1.5, () => {
        scene.player.body.setAllowGravity(true);
    }, [], this);
}

export function toggleDevMode() {
    DEV_MODE = !DEV_MODE;
    console.log("DEV_MODE agora está: " + DEV_MODE);
    window.DEV_MODE = DEV_MODE;
}

Object.defineProperty(window, 'devMode', {
    get: function () {
        toggleDevMode();
        return DEV_MODE;
    }
});

export function isDevMode() {
    return window.DEV_MODE;
}