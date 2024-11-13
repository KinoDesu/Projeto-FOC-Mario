import { BLOCK_SIZE, CANVA_WIDTH } from '../Config.js'

export class Sign extends Phaser.Physics.Arcade.Sprite {
    constructor(config, itemData) {
        super(config.scene, config.x, config.y, 'sign');
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this, true);

        let maxBoxWidth = CANVA_WIDTH - 20;
        let padding = 10;

        this.textObject = config.scene.add.text(0, 0, itemData.text, {
            fontSize: '18px',
            fill: '#472709',
            align: 'center',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            wordWrap: { width: maxBoxWidth - 2 * padding }
        })


        let boxWidth = Math.min(this.textObject.width + padding * 2, maxBoxWidth);
        let boxHeight = this.textObject.height + padding * 2;

        this.textObject.setPosition(
            padding - boxWidth / 2,
            padding - boxHeight / 2
        );

        this.textBox = config.scene.add.graphics();
        this.textBox.lineStyle(4, 0x733800);
        this.textBox.fillStyle(0xBC6509, 1);
        this.textBox.fillRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 15);
        this.textBox.strokeRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 15);

        this.container = config.scene.add.container(config.scene.cameras.main.width / 2, ((this.y + this.height / 2) - boxHeight) - BLOCK_SIZE * 5, [this.textBox, this.textObject]);
        this.container.setDepth(2);

        config.scene.events.on('update', () => {
            this.container.setPosition(config.scene.cameras.main.midPoint.x, config.scene.cameras.main.midPoint.y);

            config.scene.signList.map((sign) => {
                if (config.scene.physics.overlap(config.scene.player, sign)) {
                    if (!sign.container.visible) {
                        sign.container.setVisible(true);
                    }
                } else {
                    sign.container.setVisible(false);
                }
            });
        });
    }
}