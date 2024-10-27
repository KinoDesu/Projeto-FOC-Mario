import { getPausedgame, setPausedgame, BLOCK_SIZE, CANVA_HEIGHT, SPIKE_HEIGHT, WORLD_WIDTH, GRAVITY, JUMP_HEIGHT, ENEMY_RIGHT, ENEMY_LEFT, dieAnim, isDevMode } from '../Config.js'
import { activeControls } from "../Game.js";
import { mainMap } from "../map/map.js";

export class Level extends Phaser.Scene {
    constructor() {
        super({ key: 'Level' });
        this.player;
        this.ground;
        this.platforms;
        this.spikes;
        this.enemies;
        this.stars = [];
        this.blockingBlocks = [];
        this.isDead = false;
        this.gameSign;
        this.controlKeys;
        this.signList = [];
        this.colliders = {
            player: {},
            enemies: {}
        }
    }



    preload() {
        this.cameras.main.setBackgroundColor('#FFF')

        this.load.image('mario', 'assets/mario.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('spike', 'assets/spike.png');
        this.load.image('enemy', 'assets/mario.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('sign', 'assets/sign.png');

    }

    create() {

        this.input.keyboard = activeControls(this);

        this.controlKeys = {
            up: this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.W],
            down: this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.S],
            left: this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.A],
            right: this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.D],
            space: this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.SPACE],
            esc: this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.ESC]
        };

        this.physics.world.setBounds(0, 0, WORLD_WIDTH, CANVA_HEIGHT);
        this.physics.world.setBoundsCollision(true, true, false, true);
        this.ground = this.physics.add.staticGroup();
        this.platforms = this.physics.add.staticGroup();
        this.spikes = this.physics.add.staticGroup();
        this.star = this.physics.add.staticGroup();
        this.gameSign = this.physics.add.staticGroup();

        this.enemies = this.physics.add.group({
            defaultKey: 'enemy'
        });

        for (let column = 0; column < mainMap[0].length; column++) {
            for (let line = 0; line < mainMap.length; line++) {
                let block = mainMap[line][column]

                switch (block.blockCode) {
                    //céu
                    case 0:
                        break;
                    //chão
                    case 1:
                        this.ground.create((column * BLOCK_SIZE) + BLOCK_SIZE / 2, CANVA_HEIGHT - (BLOCK_SIZE * (16 - line) + (BLOCK_SIZE / 2)), 'ground').refreshBody();
                        break;
                    //platarforma
                    case 2:
                        this.platforms.create(BLOCK_SIZE * column + (BLOCK_SIZE / 2), CANVA_HEIGHT - (BLOCK_SIZE * (16 - line) + (BLOCK_SIZE / 2)), 'platform');
                        break;
                    //espinho
                    case 3:
                        this.spikes.create(BLOCK_SIZE * column + (BLOCK_SIZE / 2), CANVA_HEIGHT - (BLOCK_SIZE * (16 - line) + (BLOCK_SIZE / 2)) + SPIKE_HEIGHT / 2, 'spike');
                        break;
                    //placa
                    case 4:
                        let gameObj = this.gameSign.create((column * BLOCK_SIZE) + BLOCK_SIZE / 2, CANVA_HEIGHT - (BLOCK_SIZE * (16 - line) + (BLOCK_SIZE / 2)), 'sign');

                        let boxWidth = 300;
                        let boxHeight = 60;
                        let boxX = (gameObj.x + gameObj.width / 2) - boxWidth / 2;
                        let boxY = ((gameObj.y + gameObj.height / 2) - boxHeight) - BLOCK_SIZE * 5;

                        let graphics = this.add.graphics();
                        graphics.lineStyle(4, 0x733800); // Define a cor da borda (vermelho) e espessura (4)
                        graphics.fillStyle(0xBC6509, 1); // Cor do fundo (preto)
                        graphics.fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 15); // Retângulo com bordas arredondadas (raio 15)
                        graphics.strokeRoundedRect(boxX, boxY, boxWidth, boxHeight, 15);
                        graphics.setVisible(false);
                        graphics.setDepth(2);

                        let txtObj = this.add.text((gameObj.x + gameObj.width / 2), boxY + boxHeight / 2, '', {
                            fontSize: '24px',
                            fill: '#472709',
                            align: 'center',
                            fontFamily: 'Arial',
                            fontStyle: 'bold'
                        }).setOrigin(0.5).setVisible(false).setDepth(3);

                        let sign = {
                            gameObj: gameObj,
                            textObj: txtObj,
                            text: "texto vazio",
                            textBox: graphics
                        };

                        sign.text = block.blockText;
                        this.signList.push(sign);

                        break;
                    //blocking block
                    case 5:
                        let blockX = BLOCK_SIZE * column + (BLOCK_SIZE / 2);
                        let blockY = CANVA_HEIGHT - (BLOCK_SIZE * (16 - line) + (BLOCK_SIZE / 2));

                        let invisibleBlock = this.add.rectangle(blockX, blockY, BLOCK_SIZE, BLOCK_SIZE, 0x000000, 0);
                        this.physics.add.existing(invisibleBlock);
                        invisibleBlock.body.setImmovable(true);
                        invisibleBlock.body.allowGravity = false;

                        let blockItem = {
                            gameObj: invisibleBlock,
                            dataObj: block
                        }

                        this.blockingBlocks.push(blockItem);
                        break;
                    case 6:
                        this.spikes.create(BLOCK_SIZE * column + (BLOCK_SIZE / 2), CANVA_HEIGHT - (BLOCK_SIZE * (16 - line) + (BLOCK_SIZE / 2)) + SPIKE_HEIGHT / 2, 'spike');
                        break;
                    //inimigo
                    case 7:
                        const enemy = this.enemies.create(BLOCK_SIZE * column + (BLOCK_SIZE / 2), CANVA_HEIGHT - (BLOCK_SIZE * (16 - line) + (BLOCK_SIZE / 2)), 'enemy');
                        enemy.setBounce(0.1);
                        enemy.setCollideWorldBounds(true);
                        enemy.setVelocityX(-100);

                        break;
                    //moeda
                    case 8:
                        let star = this.physics.add.sprite(BLOCK_SIZE * column + (BLOCK_SIZE / 2), CANVA_HEIGHT - (BLOCK_SIZE * (16 - line) + (BLOCK_SIZE / 2)), 'star');
                        star.body.setAllowGravity(false);

                        let starItem = {
                            gameObj: star,
                            dataObj: block,
                            isGot: false
                        }

                        this.stars.push(starItem);
                        break;
                    //mario
                    case 9:
                        this.player = this.physics.add.sprite(BLOCK_SIZE * column + (BLOCK_SIZE / 2), CANVA_HEIGHT - (BLOCK_SIZE * (16 - line + 1) + (BLOCK_SIZE / 2)), 'mario');
                        this.player.setSize(BLOCK_SIZE - 20, BLOCK_SIZE);
                        this.player.setCollideWorldBounds(true);
                        this.player.setDepth(1);
                        break;

                    default:
                        break;
                }
            }
        }

        this.colliders.player = {
            ground: this.physics.add.collider(this.player, this.ground),
            platforms: this.physics.add.collider(this.player, this.platforms),
            spike: this.physics.add.collider(this.player, this.spikes, this.hitSpike, null, this),
            enemy: this.physics.add.collider(this.player, this.enemies, this.hitEnemy, null, this)
        }

        this.colliders.enemies = {
            ground: this.physics.add.collider(this.enemies, this.ground),
            platforms: this.physics.add.collider(this.enemies, this.platforms),
            invisibleBlock: this.physics.add.collider(this.enemies, this.blockingBlocks),
            spike: this.physics.add.collider(this.enemies, this.spikes, this.hitSpike, null, this)
        }

        this.blockingBlocks.map((blockingBlock) => {
            this.physics.add.collider(this.player, blockingBlock.gameObj);
            this.physics.add.collider(this.enemies, blockingBlock.gameObj);
        });

        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, CANVA_HEIGHT);
        this.cameras.main.startFollow(this.player);

        this.input.keyboard.on('keydown-ESC', () => {
            setPausedgame(true);
            this.scene.launch('GamePausedScene', { fromScene: 'Level' });
            this.scene.pause();
        }, this)
    }

    update() {

        this.signList.map((signItem) => {

            if (this.physics.overlap(this.player, signItem.gameObj)) {
                if (!signItem.textObj.visible) {
                    signItem.textObj.setText(signItem.text);
                    signItem.textObj.setVisible(true);
                    signItem.textBox.setVisible(true);
                    this.showInfoText;
                }
            } else {
                signItem.textBox.setVisible(false);
                signItem.textObj.setVisible(false);
            }
        });

        this.stars.map((star) => {
            if (this.physics.overlap(this.player, star.gameObj)) {
                star.gameObj.destroy();
                star.isGot = true;
            }
        });

        if (this.isDead) {
            return
        }

        this.player.setVelocityX(0);

        if (getPausedgame(0)) {
            return;
        }

        this.enemies.children.iterate(function (enemy) {
            if (enemy.body.blocked.right) {
                enemy.setVelocityX(ENEMY_LEFT);
            }
            else if (enemy.body.blocked.left) {
                enemy.setVelocityX(ENEMY_RIGHT);
            }
        });

        if (this.controlKeys['right'].isDown) {
            this.player.setVelocityX(160);
        }
        else if (this.controlKeys['left'].isDown) {
            this.player.setVelocityX(-160);
        }

        if ((this.controlKeys['up'].isDown || this.controlKeys['space'].isDown) && this.player.body.touching.down) {
            this.player.setVelocityY(-Math.sqrt(2 * GRAVITY * JUMP_HEIGHT));
        }
    }

    hitSpike() {
        if (isDevMode()) {
            return;
        }
        this.isDead = true;
        dieAnim(this);
        this.time.delayedCall(2000, () => {
            this.isDead = false;
            this.scene.start('GameOverScene', { previousScene: this.scene.key });
        }, [], this);
    }
    hitEnemy(player, enemy) {
        if (player.body.bottom < enemy.body.top + 10) {
            enemy.destroy();
            player.setVelocityY(-Math.sqrt(2 * GRAVITY * JUMP_HEIGHT) / 1.20);
        } else if (!isDevMode()) {
            this.isDead = true;
            dieAnim(this);
            this.time.delayedCall(2000, () => {
                this.isDead = false;
                this.scene.start('GameOverScene', { previousScene: this.scene.key });
            }, [], this);
        }
    }

}

const signTexts = {
    1: "placa 1",
    2: "placa 2",
    3: "placa 3",
    4: "placa 4",
    5: "placa 5",
    6: "placa 6"
}