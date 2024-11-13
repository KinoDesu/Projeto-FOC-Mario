import { BLOCK_SIZE, CANVA_HEIGHT, CANVA_WIDTH } from "../game/Config.js";
import { endAnimation, startAnimation } from "./AnimationHub.js";
import { Star } from "../game/item/Star.js";

export class LoseOHWinHAndTurnsToMalato {
    constructor() {
        this.scene;
        this.fumarato;
        this.malato;
        this.finalXPosition
        this.finalYPosition
        this.crossingPoint1Y;
        this.crossingPoint2Y;
        this.finalPointY;
        this.xPos1;
        this.newH;
    }

    animate(scene, gotEventPoint) {

        this.scene = scene;

        startAnimation(scene, gotEventPoint).then(() => {
            this.begin();
        });
    }

    begin() {
        this.finalXPosition = this.scene.player.x;
        this.finalYPosition = this.scene.player.y - this.scene.player.height - BLOCK_SIZE;

        this.crossingPoint1Y = this.scene.player.y - this.scene.player.height * 1;
        this.crossingPoint2Y = this.scene.player.y - this.scene.player.height * 2;
        this.finalPointY = this.scene.player.y - (3 * this.scene.player.height);
        this.xPos1 = BLOCK_SIZE + 16;


        this.scene.friendStars.forEach((star) => {
            if (star.active) {
                star.destroy();
                star.name.destroy();
            }
        })

        this.fumarato = new Star({ x: this.scene.friendStars[0].x, y: this.scene.friendStars[0].y, scene: this.scene, name: "Fumarato" });
        this.fumarato.isGot = true;

        this.fumaratoGoUp();
    }

    fumaratoGoUp() {
        this.scene.cameras.main.zoomTo(2, 1000);
        this.scene.tweens.add({
            targets: this.fumarato,
            x: this.scene.player.x,
            y: this.finalYPosition,
            duration: 500,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.loseOH();
            }
        });
    }

    loseOH() {
        const oh = new Star({ x: this.fumarato.x, y: this.fumarato.y, scene: this.scene, name: "OH" });
        oh.setScale(0.5);
        oh.isGot = true;

        this.scene.tweens.add({
            targets: oh,
            x: this.fumarato.x - BLOCK_SIZE,
            y: this.fumarato.y - BLOCK_SIZE,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                setTimeout(() => {
                    this.scene.tweens.add({
                        targets: oh,
                        x: this.scene.player.x + CANVA_WIDTH,
                        y: -CANVA_HEIGHT,
                        duration: 1500,
                        ease: 'Sine.easeOut',
                        onComplete: () => {
                            this.winH();
                        }
                    });
                }, 500)
            }
        });
    }

    winH() {

        this.newH = new Star({ x: this.scene.player.x + CANVA_WIDTH, y: -CANVA_HEIGHT, scene: this.scene, name: "H" });

        this.scene.tweens.add({
            targets: this.newH,
            x: this.fumarato.x - BLOCK_SIZE,
            y: this.fumarato.y - BLOCK_SIZE,
            duration: 2000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.FumaratoAndHGetsDistance();
            }
        });
    }

    FumaratoAndHGetsDistance() {
        this.scene.tweens.add({
            targets: this.fumarato,
            x: this.scene.player.x + this.xPos1,
            y: this.scene.player.y,
            duration: 500,
            ease: 'Sine.easeOut',
        });

        this.scene.tweens.add({
            targets: this.newH,
            x: this.scene.player.x - this.xPos1,
            y: this.scene.player.y,
            duration: 500,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.event1();
            }
        });
    }

    event1() {
        this.scene.tweens.add({
            targets: this.fumarato,
            x: this.scene.player.x + this.xPos1,
            y: this.crossingPoint1Y,
            duration: 1000,
            ease: 'Sine.easeOut',
        });

        this.scene.tweens.add({
            targets: this.newH,
            x: this.scene.player.x - this.xPos1,
            y: this.crossingPoint1Y,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.event2();
            }
        });

    }

    event2() {
        this.scene.tweens.add({
            targets: this.fumarato,
            x: this.scene.player.x - this.xPos1,
            y: this.crossingPoint2Y,
            duration: 1000,
            ease: 'Sine.easeOut'
        });

        this.scene.tweens.add({
            targets: this.newH,
            x: this.scene.player.x + this.xPos1,
            y: this.crossingPoint2Y,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.event3();
            }
        });
    }

    event3() {

        this.scene.tweens.add({
            targets: this.fumarato,
            x: this.scene.player.x,
            y: this.finalPointY,
            duration: 1000,
            ease: 'Sine.easeOut'
        });

        this.scene.tweens.add({
            targets: this.newH,
            x: this.scene.player.x,
            y: this.finalPointY,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.turnToMalato();
            }
        });
    }


    turnToMalato() {
        const glow = this.scene.add.circle(this.fumarato.x, this.fumarato.y, 20, 0xfffffffff).setAlpha(0);

        this.scene.tweens.add({
            targets: glow,
            alpha: 0.75,
            scale: 100,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                this.scene.cameras.main.zoomTo(1, 1000);
                this.fumarato.destroy();
                this.fumarato.name.destroy();
                this.newH.destroy();
                this.newH.name.destroy();

                this.scene.friendStars = [];
                this.malato = new Star({ x: this.fumarato.x, y: this.fumarato.y, scene: this.scene, name: "Malato" });
                this.malato.isGot = true;
                this.scene.friendStars.push(this.malato);

                this.end();
            }
        });
    }

    end() {
        endAnimation(this.scene);
    }
}