import { ENEMY_RIGHT, ENEMY_LEFT, isDevMode, GRAVITY, JUMP_HEIGHT, dieAnim } from '../Config.js'


export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, 'enemy');
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this, false);
        this.setCollideWorldBounds(true);
        this.setVelocityX(ENEMY_LEFT);
        this.setBounce(0.1);
        this.lastVelocity;
        config.scene.events.on('update', () => {
            if (!this.active || config.scene.animationEvent) {
                return;
            }
            this.walk();
        });

    }

    walk() {
        if (this.body.touching.right) {
            this.setVelocityX(ENEMY_LEFT);
        }
        else if (this.body.touching.left) {
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
            scene.player.lifes -= 1;
            scene.time.delayedCall(2000, () => {
                if (scene.player.lifes > 0) {
                    scene.setColliders();
                    scene.backToSpawnPoint();
                    scene.player.isDead = false;
                    scene.player.clearTint();
                    scene.hearts[scene.player.lifes].setTexture('noheart');
                    scene.hearts[scene.player.lifes].setAlpha(0.5);
                } else {
                    scene.scene.start('GameOverScene', { previousScene: scene.scene.key });
                }
            }, [], scene);
        }
    }
}