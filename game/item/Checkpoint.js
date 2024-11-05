export class Checkpoint extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, 'checkpoint');
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this, true);
        this.isGot = false;
    }
}