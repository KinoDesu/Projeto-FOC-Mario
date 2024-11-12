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
        this.canJump = false;

        config.scene.events.on('update', () => {

            if (this.isDead || getPausedgame() || !this.active || config.scene.animationEvent) {

                return
            }

            this.setVelocityX(0);

            if (config.scene.controlKeys['right'].isDown) {
                this.setVelocityX(160);
            }
            else if (config.scene.controlKeys['left'].isDown) {
                this.setVelocityX(-160);
            }

            if ((config.scene.controlKeys['up'].isDown || config.scene.controlKeys['space'].isDown) && this.canJump) {
                if (this.body.touching.down & (!config.scene.physics.overlap(this, config.scene.friendStars))) {
                    this.canJump = false;
                    this.setVelocityY(-Math.sqrt(2 * GRAVITY * JUMP_HEIGHT));
                }
            }

            if (config.scene.friendStars.length > 0) {
                config.scene.friendStars.forEach((friendStar, index) => {
                    let smooth = 0.015 / (index + 1);
                    friendStar.x += ((this.x - this.width - index * (BLOCK_SIZE + 10)) - friendStar.x) * smooth;
                    friendStar.y += (this.y - friendStar.y - index) * smooth;
                });
            }
        });
    }
}