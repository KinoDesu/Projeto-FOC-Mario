import { BLOCK_SIZE, CANVA_HEIGHT, CANVA_WIDTH } from "../game/Config.js";
import { endAnimation, startAnimation } from "./AnimationHub.js";
import { Star } from "../game/item/Star.js";

export class AcetilAndOxalatoToCitrato {
    constructor() {
        this.acetilCoa;
        this.acetil;
        this.oxalato;
        this.playerX;
        this.playerY;
        this.crossingPoint1Y;
        this.crossingPoint2Y;
        this.finalPointY;
        this.xPos1;
        this.scene
    }
    animate(scene, gotEventPoint) {

        this.scene = scene;

        if (scene.friendStars.length <= 1) {
            return;
        }
        startAnimation(scene, gotEventPoint).then(() => {
            this.begin();
        });

    }

    begin() {
        this.playerX = this.scene.player.x;
        this.playerY = this.scene.player.y;

        this.crossingPoint1Y = this.scene.player.y - this.scene.player.height * 1;
        this.crossingPoint2Y = this.scene.player.y - this.scene.player.height * 2;
        this.finalPointY = this.playerY - (3 * this.scene.player.height);
        this.xPos1 = BLOCK_SIZE + 16;

        this.scene.friendStars.forEach((star) => {
            if (star.active) {
                star.destroy();
                star.name.destroy();
            }
        })


        this.acetilCoa = new Star({ x: this.scene.friendStars[0].x, y: this.scene.friendStars[0].y, scene: this.scene, name: "acetil-CoA" });
        this.acetilCoa.isGot = true;

        this.oxalato = new Star({ x: this.scene.friendStars[1].x, y: this.scene.friendStars[1].y, scene: this.scene, name: "oxalato" });
        this.oxalato.isGot = true;

        this.acetilCoaAndOxalatoGetsDistance();
    }

    acetilCoaAndOxalatoGetsDistance() {
        this.scene.tweens.add({
            targets: this.acetilCoa,
            x: this.playerX + this.xPos1,
            y: this.playerY,
            duration: 500,
            ease: 'Sine.easeOut',
        });

        this.scene.tweens.add({
            targets: this.oxalato,
            x: this.playerX - this.xPos1,
            y: this.playerY,
            duration: 500,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.acetilCoaDivide();
            }
        });
    }

    acetilCoaDivide() {

        this.scene.cameras.main.zoomTo(2, 1000);

        this.scene.tweens.add({
            targets: this.acetilCoa,
            x: this.playerX,
            y: this.playerY - (2 * this.scene.player.height),
            duration: 500,
            ease: 'Sine.easeOut',
            onComplete: () => {
                const glow = this.scene.add.circle(this.acetilCoa.x, this.acetilCoa.y, 20, 0xfffffffff).setAlpha(0);

                this.scene.tweens.add({
                    targets: glow,
                    alpha: 0.8,
                    scale: 100,
                    duration: 200,
                    yoyo: true,
                    onComplete: () => {

                        this.acetil = new Star({ x: this.acetilCoa.x - BLOCK_SIZE, y: this.acetilCoa.y, scene: this.scene, name: "acetil" });
                        this.acetil.isGot = true;

                        const coa = new Star({ x: this.acetilCoa.x + BLOCK_SIZE, y: this.acetilCoa.y, scene: this.scene, name: "CoA" });
                        coa.setScale(0.5);
                        coa.isGot = true;
                        this.acetilCoa.destroy();
                        this.acetilCoa.name.destroy();
                        glow.destroy();

                        this.scene.tweens.add({
                            targets: coa,
                            x: this.playerX,
                            y: this.playerY - (2.5 * this.scene.player.height),
                            duration: 2000,
                            ease: 'Sine.easeOut',
                            onComplete: () => {
                                this.scene.tweens.add({
                                    targets: coa,
                                    x: this.playerX + CANVA_WIDTH,
                                    y: -CANVA_HEIGHT,
                                    duration: 2500,
                                    ease: 'Sine.easeOut',
                                    onComplete: () => {
                                        this.scene.tweens.add({
                                            targets: this.acetil,
                                            x: this.playerX + this.xPos1,
                                            y: this.playerY,
                                            duration: 1500,
                                            ease: 'Sine.easeOut',
                                            onComplete: () => {
                                                this.event1();
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    event1() {
        this.scene.tweens.add({
            targets: this.acetil,
            x: this.playerX + this.xPos1,
            y: this.crossingPoint1Y,
            duration: 1000,
            ease: 'Sine.easeOut',
        });

        this.scene.tweens.add({
            targets: this.oxalato,
            x: this.playerX - this.xPos1,
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
            targets: this.acetil,
            x: this.playerX - this.xPos1,
            y: this.crossingPoint2Y,
            duration: 1000,
            ease: 'Sine.easeOut'
        });

        this.scene.tweens.add({
            targets: this.oxalato,
            x: this.playerX + this.xPos1,
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
            targets: this.acetil,
            x: this.playerX,
            y: this.finalPointY,
            duration: 1000,
            ease: 'Sine.easeOut'
        });

        this.scene.tweens.add({
            targets: this.oxalato,
            x: this.playerX,
            y: this.finalPointY,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.createCitrato();
            }
        });
    }

    createCitrato() {
        const glow = this.scene.add.circle(this.acetil.x, this.acetil.y, 20, 0xfffffffff).setAlpha(0);

        this.scene.tweens.add({
            targets: glow,
            alpha: 0.8,
            scale: 100,
            duration: 200,
            yoyo: true,
            onComplete: () => {
                this.scene.cameras.main.zoomTo(1, 1000);

                this.acetil.destroy();
                this.acetil.name.destroy();
                this.oxalato.destroy();
                this.oxalato.name.destroy();

                this.scene.friendStars = [];
                const citrato = new Star({ x: this.playerX, y: this.finalPointY, scene: this.scene, name: "Citrato" });
                citrato.isGot = true;
                this.scene.friendStars.push(citrato);

                this.end();
            }
        });
    }

    end() {
        endAnimation(this.scene);
    }

}