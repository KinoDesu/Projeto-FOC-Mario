import { BLOCK_SIZE, GRAVITY, JUMP_HEIGHT, getPausedgame } from '../Config.js'

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, 'player');
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this, false);
        this.setSize(BLOCK_SIZE - 20, BLOCK_SIZE);
        this.setCollideWorldBounds(true);
        this.setDepth(1);
        this.isDead = false;
        this.spawnPoint;
        this.lifes = 5;

        config.scene.events.on('update', () => {

            if (this.isDead || getPausedgame() || !this.active) {
                return
            }

            this.setVelocityX(0);

            if (config.scene.controlKeys['right'].isDown) {
                this.setVelocityX(160);
            }
            else if (config.scene.controlKeys['left'].isDown) {
                this.setVelocityX(-160);
            }

            if ((config.scene.controlKeys['up'].isDown || config.scene.controlKeys['space'].isDown) && this.body.touching.down) {
                this.setVelocityY(-Math.sqrt(2 * GRAVITY * JUMP_HEIGHT));
            }
        });
    }
}