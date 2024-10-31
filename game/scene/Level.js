import { getPausedgame, setPausedgame, BLOCK_SIZE, CANVA_HEIGHT, CANVA_WIDTH, SPIKE_HEIGHT, WORLD_WIDTH, GRAVITY, JUMP_HEIGHT, ENEMY_RIGHT, ENEMY_LEFT, dieAnim, isDevMode } from '../Config.js'
import { activeControls } from "../Game.js";
import { Player } from "../entity/Player.js";
import { Ground } from "../block/Ground.js";
import { Platform } from "../block/Platform.js";
import { Spike } from "../block/Spike.js";
import { BlockingBlock } from "../block/BlockingBlock.js";
import { Sign } from "../item/Sign.js";
import { BLOCKS } from "../map/Map.js";
import { Checkpoint } from '../item/Checkpoint.js';
export class Level extends Phaser.Scene {
    constructor() {
        super({ key: 'Level' });
        this.controlKeys;
        this.player;
        this.grounds = [];
        this.platforms = [];
        this.spikes = [];
        this.enemies = [];
        this.stars = [];
        this.blockingBlocks = [];
        this.checkpoints = [];
        this.signList = [];
        this.colliders = {
            player: {},
            enemies: {}
        }
    }



    preload() {
        this.cameras.main.setBackgroundColor('#bce5f9')

        this.load.image('player', 'assets/player.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('spike', 'assets/spike.png');
        this.load.image('enemy', 'assets/player.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('sign', 'assets/sign.png');
        this.load.image('checkpoint', 'assets/checkpoint.png');

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

        this.enemies = this.physics.add.group({
            defaultKey: 'enemy'
        });

        BLOCKS.map(block => {
            block.data.map(itemData => {
                let column = itemData.x;
                let line = itemData.y;

                let x = BLOCK_SIZE * column + (BLOCK_SIZE / 2);
                let y = CANVA_HEIGHT - (BLOCK_SIZE * (16 - line) + (BLOCK_SIZE / 2));

                switch (itemData.code) {

                    //player
                    case 0:
                        this.player = new Player({ scene: this, x: x, y: y - BLOCK_SIZE });
                        break;
                    //chão
                    case 1:
                        this.grounds.push(new Ground({ scene: this, x: x, y: y }));
                        break;
                    //platarforma
                    case 2:
                        this.platforms.push(new Platform({ scene: this, x: x, y: y }));
                        break;
                    //espinho
                    case 3:
                        this.spikes.push(new Spike({ scene: this, x: x, y: y + SPIKE_HEIGHT / 2 }));
                        break;
                    //placa
                    case 4:
                        this.signList.push(new Sign({ scene: this, x: x, y: y }, itemData));
                        break;
                    //blocking block
                    case 5:
                        this.blockingBlocks.push(new BlockingBlock({ scene: this, x: x, y: y }));
                        break;
                    //checkpoint
                    case 6:
                        this.checkpoints.push(new Checkpoint({ scene: this, x: x, y: y }));
                        break;
                    //inimigo
                    case 7:
                        const enemy = this.enemies.create(x, y, 'enemy');
                        enemy.setBounce(0.1);
                        enemy.setCollideWorldBounds(true);
                        enemy.setVelocityX(-100);

                        break;
                    //moeda
                    case 8:
                        let star = this.physics.add.sprite(x, y, 'star');
                        star.body.setAllowGravity(false);

                        let starItem = {
                            gameObj: star,
                            dataObj: block,
                            isGot: false
                        }

                        this.stars.push(starItem);
                        break;
                    default:
                        break;
                }

            });
        });

        this.colliders.player = {
            ground: this.physics.add.collider(this.player, this.grounds),
            platforms: this.physics.add.collider(this.player, this.platforms),
            spike: this.physics.add.collider(this.player, this.spikes, this.hitSpike, null, this),
            enemy: this.physics.add.collider(this.player, this.enemies, this.hitEnemy, null, this),
            blockingBlock: this.physics.add.collider(this.player, this.blockingBlocks)
        }

        this.colliders.enemies = {
            ground: this.physics.add.collider(this.enemies, this.grounds),
            platforms: this.physics.add.collider(this.enemies, this.platforms),
            invisibleBlock: this.physics.add.collider(this.enemies, this.blockingBlocks),
            spike: this.physics.add.collider(this.enemies, this.spikes, this.hitSpike, null, this),
            blockingBlock: this.physics.add.collider(this.enemies, this.blockingBlocks)
        }

        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, CANVA_HEIGHT);
        this.cameras.main.startFollow(this.player);

        this.input.keyboard.on('keydown-ESC', () => {
            setPausedgame(true);
            this.scene.launch('GamePausedScene', { fromScene: 'Level' });
            this.scene.pause();
        }, this)
    }

    update() {
        this.stars.map((star) => {
            if (this.physics.overlap(this.player, star.gameObj)) {
                star.gameObj.destroy();
                star.isGot = true;
                this.removeInvisibleBlock(star);
            }
        });

        if (this.player.isDead) {
            return
        }

        this.player.setVelocityX(0);

        if (getPausedgame()) {
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
        this.player.isDead = true;
        dieAnim(this);
        this.time.delayedCall(2000, () => {
            this.player.isDead = false;
            this.scene.start('GameOverScene', { previousScene: this.scene.key });
        }, [], this);
    }
    hitEnemy(player, enemy) {
        if (player.body.bottom < enemy.body.top + 10) {
            enemy.destroy();
            player.setVelocityY(-Math.sqrt(2 * GRAVITY * JUMP_HEIGHT) / 1.20);
        } else if (!isDevMode()) {
            this.player.isDead = true;
            dieAnim(this);
            this.time.delayedCall(2000, () => {
                this.player.isDead = false;
                this.scene.start('GameOverScene', { previousScene: this.scene.key });
            }, [], this);
        }
    }

    removeInvisibleBlock(star) {
        let closestDistance = Infinity;
        let closestBlock = null;

        for (const invisibleBlock of this.blockingBlocks) {
            const distance = Math.abs(star.gameObj.x - invisibleBlock.x);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestBlock = invisibleBlock;
            }
        }

        if (closestBlock) {
            for (const invisibleBlock of this.blockingBlocks) {
                if (invisibleBlock.x == closestBlock.x) {
                    invisibleBlock.destroy();
                }
            }

        }
    }
}