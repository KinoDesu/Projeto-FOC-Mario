export class Star extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, 'star');
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.isGot = false;

        config.scene.events.on('update', () => {
            this.getStar(config.scene);
        });
    }

    getStar(scene) {
        if (scene.physics.overlap(scene.player, this)) {

            this.destroy();
            this.isGot = true;
            this.removeInvisibleBlock(scene);
        }
    }

    removeInvisibleBlock(scene) {
        let closestDistance = Infinity;
        let closestBlock = null;

        for (const invisibleBlock of scene.blockingBlocks) {
            const distance = Math.abs(this.x - invisibleBlock.x);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestBlock = invisibleBlock;
            }
        }

        if (closestBlock) {
            for (const invisibleBlock of scene.blockingBlocks) {
                if (invisibleBlock.x == closestBlock.x) {
                    invisibleBlock.destroy();
                }
            }

        }
    }
}