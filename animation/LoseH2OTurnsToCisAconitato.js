import { BLOCK_SIZE, CANVA_HEIGHT, CANVA_WIDTH } from "../game/Config.js";
import { endAnimation, startAnimation } from "./AnimationHub.js";
import { Star } from "../game/item/Star.js";


export class LoseH2OTurnsToCisAconitato {
    constructor() {
        this.scene
        this.citrato;
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

        this.citrato = new Star({ x: this.scene.friendStars[0].x, y: this.scene.friendStars[0].y, scene: this.scene, name: "Citrato" });
        this.citrato.isGot = true;

        this.citratoLosesWater();
    }

    citratoLosesWater() {
        this.scene.cameras.main.zoomTo(2, 1000);
        this.scene.tweens.add({
            targets: this.citrato,
            x: this.scene.player.x,
            y: this.finalYPosition,
            duration: 500,
            ease: 'Sine.easeOut',
            onComplete: () => {
                const water = new Star({ x: this.citrato.x, y: this.citrato.y, scene: this.scene, name: "H₂O" });
                water.setScale(0.5);
                water.isGot = true;

                this.scene.tweens.add({
                    targets: water,
                    x: this.citrato.x - BLOCK_SIZE,
                    y: this.citrato.y - BLOCK_SIZE,
                    duration: 1000,
                    ease: 'Sine.easeOut',
                    onComplete: () => {
                        setTimeout(() => {
                            this.scene.tweens.add({
                                targets: water,
                                x: this.scene.player.x + CANVA_WIDTH,
                                y: -CANVA_HEIGHT,
                                duration: 1500,
                                ease: 'Sine.easeOut',
                                onComplete: () => {
                                    this.turnsToCisAconitato();
                                }
                            });
                        }, 500)
                    }
                });

            }
        });
    }

    turnsToCisAconitato() {
        const glow = this.scene.add.circle(this.citrato.x, this.citrato.y, 20, 0xfffffffff).setAlpha(0);

        this.scene.tweens.add({
            targets: glow,
            alpha: 0.75,
            scale: 100,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                this.scene.cameras.main.zoomTo(1, 1000);

                this.citrato.destroy();
                this.citrato.name.destroy();

                this.scene.friendStars = [];
                const cisAconitato = new Star({ x: this.finalXPosition, y: this.finalYPosition, scene: this.scene, name: "Cis-Aconitato" });
                cisAconitato.isGot = true;
                this.scene.friendStars.push(cisAconitato);

                this.end();
            }
        });
    }
    end() {
        endAnimation(this.scene);
    }
}