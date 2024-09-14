import { GameOverScene } from './scenes/GameOverScene.js';
import { MainScene } from './scenes/MainScene.js';
import { BLOCK_SIZE, CANVA_WIDTH, CANVA_HEIGHT, SPIKE_HEIGHT, SPIKE_WIDTH, WORLD_WIDTH, PLAYER_SIZE, GRAVITY, JUMP_HEIGHT, ENEMY_RIGHT, ENEMY_LEFT } from './Config.js'


const CONFIG = {
    type: Phaser.AUTO,
    width: CANVA_WIDTH,
    height: CANVA_HEIGHT,
    parent: 'gameContainer',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GRAVITY },
            debug: true
        }
    },
    scale: {
        mode: Phaser.Scale.NONE,
        width: CANVA_WIDTH,
        height: CANVA_HEIGHT,
    },
    scene: [MainScene, GameOverScene]
};

const GAME = new Phaser.Game(CONFIG);