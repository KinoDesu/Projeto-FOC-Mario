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
import { Enemy } from '../entity/Enemy.js';
import { Star } from '../item/Star.js';
export class Level extends Phaser.Scene {
    constructor() {
        super({ key: 'Level' });
        this.controlKeys;
        this.player;
        this.hearts = [];
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
        this.load.image('heart', 'assets/heart.png');
        this.load.image('noheart', 'assets/noheart.png');

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

        BLOCKS.map(block => {
            block.data.map(itemData => {
                let column = itemData.x;
                let line = itemData.y;

                let x = BLOCK_SIZE * column + (BLOCK_SIZE / 2);
                let y = CANVA_HEIGHT - (BLOCK_SIZE * (16 - line) + (BLOCK_SIZE / 2));

                switch (itemData.code) {
                    //chão
                    case 0:
                        this.grounds.push(new Ground({ scene: this, x: x, y: y }));
                        break;
                    //platarforma
                    case 1:
                        this.platforms.push(new Platform({ scene: this, x: x, y: y }));
                        break;
                    //espinho
                    case 2:
                        this.spikes.push(new Spike({ scene: this, x: x, y: y + SPIKE_HEIGHT / 2 }));
                        break;
                    //placa
                    case 3:
                        this.signList.push(new Sign({ scene: this, x: x, y: y }, itemData));
                        break;
                    //blocking block
                    case 4:
                        this.blockingBlocks.push(new BlockingBlock({ scene: this, x: x, y: y }));
                        break;
                    //checkpoint
                    case 5:
                        this.checkpoints.push(new Checkpoint({ scene: this, x: x, y: y }));
                        break;
                    //inimigo
                    case 6:
                        this.enemies.push(new Enemy({ scene: this, x: x, y: y }));
                        break;
                    //moeda
                    case 7:
                        this.stars.push(new Star({ scene: this, x: x, y: y }));
                        break;
                    default:
                        break;
                }
            });
        });

        this.player = new Player({ scene: this, x: 0, y: 0 - BLOCK_SIZE });
        this.player.spawnPoint = this.checkpoints[0];
        this.backToSpawnPoint();

        this.setColliders();

        for (let i = 0; i < this.player.lifes; i++) {
            let heart = this.add.image(20 + i * ((BLOCK_SIZE / 2) + 12), 40, 'heart');
            heart.setScrollFactor(0);
            this.hearts.push(heart);
        }

        this.input.keyboard.on('keydown-ESC', () => {
            setPausedgame(true);
            this.scene.launch('GamePausedScene', { fromScene: 'Level' });
            this.scene.pause();
        }, this)
    }

    update() {
        this.checkpoints.forEach(checkpoint => {
            if (this.physics.overlap(this.player, checkpoint) && !checkpoint.isGot) {
                this.player.spawnPoint = checkpoint;
                checkpoint.isGot = true;
            }
        });
    }

    backToSpawnPoint() {
        let xPos = this.player.spawnPoint.x;
        let yPos = this.player.spawnPoint.y - BLOCK_SIZE;
        this.player.x = xPos;
        this.player.y = yPos;
    }

    setColliders() {
        this.colliders = new Map();

        let playerColliders = new Map();
        playerColliders.set("ground", this.physics.add.collider(this.player, this.grounds))
        playerColliders.set("platforms", this.physics.add.collider(this.player, this.platforms))
        playerColliders.set("spike", this.physics.add.collider(this.player, this.spikes, (player, spike) => {
            spike.hitSpike(this);
        }, null, this))
        playerColliders.set("enemy", this.physics.add.collider(this.player, this.enemies, (player, enemy) => {
            enemy.hitEnemy(this);
        }, null, this))
        playerColliders.set("blockingBlock", this.physics.add.collider(this.player, this.blockingBlocks))
        this.colliders.set("player", playerColliders)

        let enemyColliders = new Map();
        enemyColliders.set("ground", this.physics.add.collider(this.enemies, this.grounds))
        enemyColliders.set("platforms", this.physics.add.collider(this.enemies, this.platforms))
        enemyColliders.set("invisibleBlock", this.physics.add.collider(this.enemies, this.blockingBlocks))
        enemyColliders.set("spike", this.physics.add.collider(this.enemies, this.spikes, this.hitSpike, null, this))
        enemyColliders.set("blockingBlock", this.physics.add.collider(this.enemies, this.blockingBlocks))
        this.colliders.set("enemy", enemyColliders)


        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, CANVA_HEIGHT);
        this.cameras.main.startFollow(this.player);
    }
}