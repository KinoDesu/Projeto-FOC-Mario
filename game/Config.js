//#region game sprite configs
export const BLOCK_SIZE = 32;
export const CANVA_WIDTH = BLOCK_SIZE * 16;
export const CANVA_HEIGHT = BLOCK_SIZE * 16;
export const SPIKE_HEIGHT = 16;
export const SPIKE_WIDTH = BLOCK_SIZE;

export const WORLD_WIDTH = BLOCK_SIZE * 100;
//#endregion

//#region player config
export const PLAYER_SIZE = BLOCK_SIZE;
//#endregion

//#region fisics config
export const GRAVITY = 400;
export const JUMP_HEIGHT = PLAYER_SIZE * 3.25;
export const ENEMY_RIGHT = 100;
export const ENEMY_LEFT = -100;


export const CONTROL_BUTTONS = {
    up: document.querySelector(".up"),
    b: document.querySelector(".b"),
    right: document.querySelector(".right"),
    left: document.querySelector(".left"),
    esc: document.querySelector(".start")
};

export function dieAnim(player, enemies) {
    player.setTint(0xff0000); // Efeito de "dano"

    enemies.setVelocityX(0);
    enemies.setVelocityY(0);

    player.setVelocityX(0);
    player.setVelocityY(0);
}