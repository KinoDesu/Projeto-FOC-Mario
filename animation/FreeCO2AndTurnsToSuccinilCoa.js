import { BLOCK_SIZE, CANVA_HEIGHT, CANVA_WIDTH } from "../game/Config.js";
import { endAnimation, startAnimation } from "./AnimationHub.js";
import { Star } from "../game/item/Star.js";

export class FreeCO2AndTurnsToSuccinilCoa {
    constructor() {
        this.scene
        this.alfaCetoglutarato;
        this.nadh;
        this.finalXPosition;
        this.finalYPosition;
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

        this.scene.friendStars.forEach((star) => {
            if (star.active) {
                star.destroy();
                star.name.destroy();
            }
        })

        this.alfaCetoglutarato = new Star({ x: this.scene.friendStars[0].x, y: this.scene.friendStars[0].y, scene: this.scene, name: "α-Cetoglutarato" });
        this.alfaCetoglutarato.isGot = true;

        this.alfaCetoglutaratoLosesCo2();
    }

    alfaCetoglutaratoLosesCo2() {
        this.scene.cameras.main.zoomTo(2, 1000);
        this.scene.tweens.add({
            targets: this.alfaCetoglutarato,
            x: this.scene.player.x,
            y: this.finalYPosition,
            duration: 500,
            ease: 'Sine.easeOut',
            onComplete: () => {
                const co2 = new Star({ x: this.alfaCetoglutarato.x, y: this.alfaCetoglutarato.y, scene: this.scene, name: "CO₂" });
                co2.setScale(0.5);
                co2.isGot = true;

                this.scene.tweens.add({
                    targets: co2,
                    x: this.alfaCetoglutarato.x - BLOCK_SIZE,
                    y: this.alfaCetoglutarato.y - BLOCK_SIZE,
                    duration: 1000,
                    ease: 'Sine.easeOut',
                    onComplete: () => {
                        setTimeout(() => {
                            this.scene.tweens.add({
                                targets: co2,
                                x: this.scene.player.x + CANVA_WIDTH,
                                y: -CANVA_HEIGHT,
                                duration: 1500,
                                ease: 'Sine.easeOut',
                                onComplete: () => {
                                    this.alfaCetoglutaratoGenerateNadh();
                                }
                            });
                        }, 500)
                    }
                });

            }
        });
    }

    alfaCetoglutaratoGenerateNadh() {
        this.scene.cameras.main.zoomTo(2, 1000);
        this.scene.tweens.add({
            targets: this.alfaCetoglutarato,
            x: this.scene.player.x,
            y: this.finalYPosition,
            duration: 500,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.nadh = new Star({ x: this.alfaCetoglutarato.x, y: this.alfaCetoglutarato.y, scene: this.scene, name: "NADH" });
                this.nadh.setScale(0.5);
                this.nadh.isGot = true;

                this.scene.tweens.add({
                    targets: this.nadh,
                    x: this.alfaCetoglutarato.x - BLOCK_SIZE,
                    y: this.alfaCetoglutarato.y - BLOCK_SIZE,
                    duration: 1000,
                    ease: 'Sine.easeOut',
                    onComplete: () => {
                        this.turnsToSuccinilCoA();
                    }
                });

            }
        });
    }

    turnsToSuccinilCoA() {
        const glow = this.scene.add.circle(this.alfaCetoglutarato.x, this.alfaCetoglutarato.y, 20, 0xfffffffff).setAlpha(0);

        this.scene.tweens.add({
            targets: glow,
            alpha: 0.75,
            scale: 100,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                this.scene.cameras.main.zoomTo(1, 1000);

                this.alfaCetoglutarato.destroy();
                this.alfaCetoglutarato.name.destroy();

                this.scene.friendStars = [];
                const succinilCoA = new Star({ x: this.finalXPosition, y: this.finalYPosition, scene: this.scene, name: "Succinil-CoA" });
                succinilCoA.isGot = true;
                this.scene.friendStars.push(succinilCoA);
                this.scene.friendStars.push(this.nadh);

                this.end();
            }
        });
    }

    end() {
        endAnimation(this.scene);
    }
}