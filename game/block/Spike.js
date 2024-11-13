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
                scene.scene.remove('Level');
                scene.scene.add('GameOverScene', GameOverScene);
                scene.scene.start('GameOverScene', { previousScene: scene.scene.key });
            }
        }, [], scene);
    }
}