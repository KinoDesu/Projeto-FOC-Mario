import { BLOCK_SIZE } from '../Config.js'

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, 'player');
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this, false);
        this.setSize(BLOCK_SIZE - 20, BLOCK_SIZE);
        this.setCollideWorldBounds(true);
        this.setDepth(1);
        this.isDead = false;
    }
}