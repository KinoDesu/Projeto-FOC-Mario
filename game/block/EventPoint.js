import { animations } from '../../animation/AnimationHub.js';
import { BLOCK_SIZE } from '../Config.js'
export class EventPoint extends Phaser.GameObjects.Graphics {
    constructor(config) {
        super(config.scene, config.x, config.y);

        this.fillStyle(0x000000, 0);
        this.fillRect(config.x, config.y, BLOCK_SIZE, BLOCK_SIZE);

        config.scene.physics.world.enable(this);

        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        config.scene.add.existing(this);
        config.scene.physics.add.existing(this, true);

        this.setPosition(config.x - BLOCK_SIZE / 2, config.y - BLOCK_SIZE / 2);
        this.body.height = BLOCK_SIZE
        this.body.width = BLOCK_SIZE

        this.isGot = false;
        this.eventCode = config.eventCode;

        config.scene.events.on('update', () => {
            this.getEvent(config.scene);
        });
    }

    getEvent(scene) {
        if (scene.physics.overlap(scene.player, this)) {
            if (!this.isGot) {
                const animation = animations[this.eventCode];
                if (animation) {
                    animation.animate(scene, this);
                }
            }
        }
    }
}