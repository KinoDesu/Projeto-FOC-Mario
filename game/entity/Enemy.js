import { ENEMY_RIGHT, ENEMY_LEFT, isDevMode, GRAVITY, JUMP_HEIGHT, dieAnim } from '../Config.js'


export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, 'enemy');
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this, false);
        this.setCollideWorldBounds(true);
        this.setVelocityX(-100);
        this.setBounce(0.1);
        config.scene.events.on('update', () => {
            if (!this.active) {
                return;
            }
            this.walk();
        });
    }

    walk() {
        if (this.body.blocked.right) {
            this.setVelocityX(ENEMY_LEFT);
        }
        else if (this.body.blocked.left) {
            this.setVelocityX(ENEMY_RIGHT);
        }
    }

    hitEnemy(scene) {
        if (scene.player.body.bottom < this.body.top + 10) {
            this.destroy();
            scene.player.setVelocityY(-Math.sqrt(2 * GRAVITY * JUMP_HEIGHT) / 1.20);
        } else if (!isDevMode()) {
            scene.player.isDead = true;
            dieAnim(scene);
            scene.time.delayedCall(2000, () => {
                scene.scene.start('GameOverScene', { previousScene: scene.scene.key });
            }, [], scene);
        }
    }
}