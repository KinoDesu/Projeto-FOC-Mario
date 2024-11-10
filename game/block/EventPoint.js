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

        this.name = config.scene.add.text(this.x, this.y - this.height / 2 - 10, config.name, {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        //TODO: Ao pegar event, libera área e faz animação

        config.scene.events.on('update', () => {
            // this.getStar(config.scene);
            this.name.setPosition(this.x, this.y - this.height / 2 - 10);
        });
    }

    // getStar(scene) {
    //     if (scene.physics.overlap(scene.player, this)) {
    //         if (!this.isGot) {
    //             if (scene.friendStar) {
    //                 scene.friendStar.destroy();
    //                 scene.friendStar.name.destroy();
    //             }
    //             scene.friendStar = this;
    //             this.isGot = true;
    //             this.removeInvisibleBlock(scene);
    //         }

    //     }
    // }

    // removeInvisibleBlock(scene) {
    //     let closestDistance = Infinity;
    //     let closestBlock = null;

    //     for (const invisibleBlock of scene.blockingBlocks) {
    //         const distance = Math.abs(this.x - invisibleBlock.x);
    //         if (distance < closestDistance) {
    //             closestDistance = distance;
    //             closestBlock = invisibleBlock;
    //         }
    //     }

    //     if (closestBlock) {
    //         for (const invisibleBlock of scene.blockingBlocks) {
    //             if (invisibleBlock.x == closestBlock.x) {
    //                 invisibleBlock.destroy();
    //             }
    //         }

    //     }
    // }
}