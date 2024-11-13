export class Star extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, 'star');
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.isGot = false;

        this.name = config.scene.add.text(this.x, this.y - this.height / 2 - 10, config.name, {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        config.scene.events.on('update', () => {
            this.getStar(config.scene);
            this.name.setPosition(this.x, this.y - this.height / 2 - 10);
        });
    }

    getStar(scene) {
        if (scene.physics.overlap(scene.player, this)) {
            if (!this.isGot) {
                scene.friendStars.push(this);
                this.isGot = true;
            }

        }
    }
}