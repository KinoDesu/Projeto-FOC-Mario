import { BLOCK_SIZE, CANVA_HEIGHT, CANVA_WIDTH } from "../game/Config.js";
import { endAnimation, startAnimation } from "./AnimationHub.js";
import { Star } from "../game/item/Star.js";

export class FreeCO2AndTurnsToAlfaCetoglutarato {
    constructor() {
        this.scene
        this.isocitrato;
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

        this.isocitrato = new Star({ x: this.scene.friendStars[0].x, y: this.scene.friendStars[0].y, scene: this.scene, name: "Isocitrato" });
        this.isocitrato.isGot = true;

        this.isocitratoLosesCo2();
    }

    isocitratoLosesCo2() {
        this.scene.cameras.main.zoomTo(2, 1000);
        this.scene.tweens.add({
            targets: this.isocitrato,
            x: this.scene.player.x,
            y: this.finalYPosition,
            duration: 500,
            ease: 'Sine.easeOut',
            onComplete: () => {
                const co2 = new Star({ x: this.isocitrato.x, y: this.isocitrato.y, scene: this.scene, name: "CO₂" });
                co2.setScale(0.5);
                co2.isGot = true;

                this.scene.tweens.add({
                    targets: co2,
                    x: this.isocitrato.x - BLOCK_SIZE,
                    y: this.isocitrato.y - BLOCK_SIZE,
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
                                    this.turnsToAlfaCetoglutarato();
                                }
                            });
                        }, 500)
                    }
                });

            }
        });
    }

    turnsToAlfaCetoglutarato() {
        const glow = this.scene.add.circle(this.isocitrato.x, this.isocitrato.y, 20, 0xfffffffff).setAlpha(0);

        this.scene.tweens.add({
            targets: glow,
            alpha: 0.75,
            scale: 100,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                this.scene.cameras.main.zoomTo(1, 1000);

                this.isocitrato.destroy();
                this.isocitrato.name.destroy();

                this.scene.friendStars = [];
                const alfaCetoglutarato = new Star({ x: this.finalXPosition, y: this.finalYPosition, scene: this.scene, name: "α-Cetoglutarato" });
                alfaCetoglutarato.isGot = true;
                this.scene.friendStars.push(alfaCetoglutarato);

                this.end();
            }
        });
    }

    end() {
        endAnimation(this.scene);
    }
}