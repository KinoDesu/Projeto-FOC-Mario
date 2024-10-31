export class Platform extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, 'platform');
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this, true);
    }
}