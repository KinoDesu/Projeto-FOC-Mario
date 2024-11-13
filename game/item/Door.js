export class Door extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, 'porta');
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
    }
}