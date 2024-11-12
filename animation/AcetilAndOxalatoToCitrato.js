import { BLOCK_SIZE, CANVA_HEIGHT, CANVA_WIDTH } from "../game/Config.js";
import { completeAnimation } from "./AnimationHub.js";
import { Star } from "../game/item/Star.js";

export class AcetilAndOxalatoToCitrato {
    constructor() {
        this.acetil;
        this.oxalato;
        this.playerX;
        this.playerY;
        this.crossingPoint1Y;
        this.crossingPoint2Y;
        this.finalPointY;
        this.xPos1;
    }
    animate(scene, gotEventPoint) {

        if (scene.friendStars.length <= 1) {
            return;
        }
        completeAnimation(scene, gotEventPoint);

        scene.enemies.forEach((e) => {
            if (e.active) {
                e.lastVelocity = e.body.velocity.x;
                e.setVelocityX(0);
            }
        });
        scene.animationEvent = true;
        scene.player.setVelocityX(0);
        scene.player.setVelocity(0);

        this.playerX = scene.player.x;
        this.playerY = scene.player.y;

        this.crossingPoint1Y = scene.player.y - scene.player.height * 1;
        this.crossingPoint2Y = scene.player.y - scene.player.height * 2;
        this.finalPointY = this.playerY - (3 * scene.player.height);
        this.xPos1 = BLOCK_SIZE + 16;

        scene.friendStars.forEach((star) => {
            if (star.active) {
                star.destroy();
                star.name.destroy();
            }
        })


        const acetilCoa = new Star({ x: scene.friendStars[0].x, y: scene.friendStars[0].y, scene: scene, name: "acetil-CoA" });
        acetilCoa.isGot = true;

        this.oxalato = new Star({ x: scene.friendStars[1].x, y: scene.friendStars[1].y, scene: scene, name: "oxalato" });
        this.oxalato.isGot = true;

        this.acetilCoaAndOxalatoGetsDistance({ acetilCoa: acetilCoa, oxalato: this.oxalato, scene: scene });
    }

    acetilCoaAndOxalatoGetsDistance(objects) {
        objects.scene.tweens.add({
            targets: objects.acetilCoa,
            x: this.playerX + this.xPos1,
            y: this.playerY,
            duration: 500,
            ease: 'Sine.easeOut',
        });

        objects.scene.tweens.add({
            targets: objects.oxalato,
            x: this.playerX - this.xPos1,
            y: this.playerY,
            duration: 500,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.acetilCoaDivide(objects);
            }
        });
    }

    acetilCoaDivide(objects) {
        objects.scene.cameras.main.setZoom(1.5);

        objects.scene.tweens.add({
            targets: objects.acetilCoa,
            x: this.playerX,
            y: this.playerY - (2 * objects.scene.player.height),
            duration: 500,
            ease: 'Sine.easeOut',
            onComplete: () => {
                const glow = objects.scene.add.circle(objects.acetilCoa.x, objects.acetilCoa.y, 20, 0xfffffffff).setAlpha(0);

                objects.scene.tweens.add({
                    targets: glow,
                    alpha: 0.8,
                    scale: 100,
                    duration: 200,
                    yoyo: true,
                    onComplete: () => {

                        this.acetil = new Star({ x: objects.acetilCoa.x - BLOCK_SIZE, y: objects.acetilCoa.y, scene: objects.scene, name: "acetil" });
                        this.acetil.isGot = true;

                        const coa = new Star({ x: objects.acetilCoa.x + BLOCK_SIZE, y: objects.acetilCoa.y, scene: objects.scene, name: "CoA" });
                        coa.isGot = true;
                        objects.acetilCoa.destroy();
                        objects.acetilCoa.name.destroy();
                        glow.destroy();

                        objects.scene.tweens.add({
                            targets: coa,
                            x: this.playerX,
                            y: this.playerY - (2.5 * objects.scene.player.height),
                            duration: 2000,
                            ease: 'Sine.easeOut',
                            onComplete: () => {
                                objects.scene.tweens.add({
                                    targets: coa,
                                    x: this.playerX + CANVA_WIDTH,
                                    y: -CANVA_HEIGHT,
                                    duration: 2500,
                                    ease: 'Sine.easeOut',
                                    onComplete: () => {
                                        objects.scene.tweens.add({
                                            targets: this.acetil,
                                            x: this.playerX + this.xPos1,
                                            y: this.playerY,
                                            duration: 1500,
                                            ease: 'Sine.easeOut',
                                            onComplete: () => {
                                                this.event1({ object1: this.acetil, object2: this.oxalato, scene: objects.scene })
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

    event1(objects) {
        objects.scene.tweens.add({
            targets: objects.object1,
            x: this.playerX + this.xPos1,
            y: this.crossingPoint1Y,
            duration: 1000,
            ease: 'Sine.easeOut',
        });

        objects.scene.tweens.add({
            targets: objects.object2,
            x: this.playerX - this.xPos1,
            y: this.crossingPoint1Y,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.event2(objects);
            }
        });

    }

    event2(objects) {
        objects.scene.tweens.add({
            targets: objects.object1,
            x: this.playerX - this.xPos1,
            y: this.crossingPoint2Y,
            duration: 1000,
            ease: 'Sine.easeOut'
        });

        objects.scene.tweens.add({
            targets: objects.object2,
            x: this.playerX + this.xPos1,
            y: this.crossingPoint2Y,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.event3(objects);
            }
        });
    }

    event3(objects) {

        objects.scene.tweens.add({
            targets: objects.object1,
            x: this.playerX,
            y: this.finalPointY,
            duration: 1000,
            ease: 'Sine.easeOut'
        });

        objects.scene.tweens.add({
            targets: objects.object2,
            x: this.playerX,
            y: this.finalPointY,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.createCitrato(objects);
            }
        });
    }

    createCitrato(objects) {
        const glow = objects.scene.add.circle(objects.object1.x, objects.object1.y, 20, 0xfffffffff).setAlpha(0);

        objects.scene.tweens.add({
            targets: glow,
            alpha: 0.8,
            scale: 100,
            duration: 200,
            yoyo: true,
            onComplete: () => {
                objects.scene.cameras.main.setZoom(1);

                objects.object1.destroy();
                objects.object1.name.destroy();
                objects.object2.destroy();
                objects.object2.name.destroy();

                objects.scene.friendStars = [];
                const citrato = new Star({ x: this.playerX, y: this.finalPointY, scene: objects.scene, name: "Citrato" });
                citrato.isGot = true;
                objects.scene.friendStars.push(citrato);

                objects.scene.animationEvent = false;
                objects.scene.enemies.forEach((e) => {
                    if (e.active) {
                        e.setVelocityX(e.lastVelocity);
                    }
                });
            }
        });
    }

}