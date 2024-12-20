export class Ground extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, 'ground');
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this, true);
    }
}