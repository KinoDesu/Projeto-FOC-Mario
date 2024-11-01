import { dieAnim, isDevMode } from '../Config.js'

export class Spike extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, 'spike');
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this, true);
    }

    hitSpike(scene) {
        if (isDevMode()) {
            return;
        }
        scene.player.isDead = true;
        dieAnim(scene);
        scene.time.delayedCall(2000, () => {
            scene.scene.start('GameOverScene', { previousScene: scene.scene.key });
        }, [], scene);
    }
}