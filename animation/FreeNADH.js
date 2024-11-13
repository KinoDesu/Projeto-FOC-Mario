import { BLOCK_SIZE, CANVA_HEIGHT, CANVA_WIDTH } from "../game/Config.js";
import { endAnimation, startAnimation } from "./AnimationHub.js";
import { Star } from "../game/item/Star.js";

export class FreeNADH {
    constructor() {
        this.scene
        this.alfaCetoglutarato;
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

        this.alfaCetoglutaratoFreeNADH();
    }

    alfaCetoglutaratoFreeNADH() {
        this.scene.cameras.main.zoomTo(2, 1000);
        this.scene.tweens.add({
            targets: this.alfaCetoglutarato,
            x: this.scene.player.x,
            y: this.finalYPosition,
            duration: 500,
            ease: 'Sine.easeOut',
            onComplete: () => {
                const nadh = new Star({ x: this.alfaCetoglutarato.x, y: this.alfaCetoglutarato.y, scene: this.scene, name: "NADH" });
                nadh.setScale(0.5);
                nadh.isGot = true;

                this.scene.tweens.add({
                    targets: nadh,
                    x: this.alfaCetoglutarato.x - BLOCK_SIZE,
                    y: this.alfaCetoglutarato.y - BLOCK_SIZE,
                    duration: 1000,
                    ease: 'Sine.easeOut',
                    onComplete: () => {
                        setTimeout(() => {
                            this.scene.tweens.add({
                                targets: nadh,
                                x: this.scene.player.x + CANVA_WIDTH,
                                y: -CANVA_HEIGHT,
                                duration: 1500,
                                ease: 'Sine.easeOut',
                                onComplete: () => {
                                    this.scene.cameras.main.zoomTo(1, 1000);
                                    this.scene.friendStars.push(this.alfaCetoglutarato)
                                    this.end();
                                }
                            });
                        }, 500)
                    }
                });

            }
        });
    }

    end() {
        endAnimation(this.scene);
    }
}