import { BLOCK_SIZE, CANVA_HEIGHT, CANVA_WIDTH } from "../game/Config.js";
import { endAnimation, startAnimation } from "./AnimationHub.js";
import { Star } from "../game/item/Star.js";

export class LoseCoaAndTurnsToSuccinato {
    constructor() {
        this.scene;
        this.succinilCoa;
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

        this.succinilCoa = new Star({ x: this.scene.friendStars[0].x, y: this.scene.friendStars[0].y, scene: this.scene, name: "Succinil-Coa" });
        this.succinilCoa.isGot = true;

        this.succinilCoaLosesCoA();
    }

    succinilCoaLosesCoA() {
        this.scene.cameras.main.zoomTo(2, 1000);
        this.scene.tweens.add({
            targets: this.succinilCoa,
            x: this.scene.player.x,
            y: this.finalYPosition,
            duration: 500,
            ease: 'Sine.easeOut',
            onComplete: () => {
                const co2 = new Star({ x: this.succinilCoa.x, y: this.succinilCoa.y, scene: this.scene, name: "CO₂" });
                co2.setScale(0.5);
                co2.isGot = true;

                this.scene.tweens.add({
                    targets: co2,
                    x: this.succinilCoa.x - BLOCK_SIZE,
                    y: this.succinilCoa.y - BLOCK_SIZE,
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
                                    this.succinilCoaGenerateNadh();
                                }
                            });
                        }, 500)
                    }
                });

            }
        });
    }

    succinilCoaGenerateNadh() {
        this.scene.tweens.add({
            targets: this.succinilCoa,
            x: this.scene.player.x,
            y: this.finalYPosition,
            duration: 500,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.gtp = new Star({ x: this.succinilCoa.x, y: this.succinilCoa.y, scene: this.scene, name: "GTP" });
                this.gtp.setScale(0.5);
                this.gtp.isGot = true;

                this.scene.tweens.add({
                    targets: this.gtp,
                    x: this.succinilCoa.x - BLOCK_SIZE,
                    y: this.succinilCoa.y - BLOCK_SIZE,
                    duration: 1000,
                    ease: 'Sine.easeOut',
                    onComplete: () => {
                        this.turnsToSuccinato();
                    }
                });

            }
        });
    }

    turnsToSuccinato() {
        const glow = this.scene.add.circle(this.succinilCoa.x, this.succinilCoa.y, 20, 0xfffffffff).setAlpha(0);

        this.scene.tweens.add({
            targets: glow,
            alpha: 0.75,
            scale: 100,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                this.scene.cameras.main.zoomTo(1, 1000);

                this.succinilCoa.destroy();
                this.succinilCoa.name.destroy();

                this.scene.friendStars = [];
                const succinato = new Star({ x: this.finalXPosition, y: this.finalYPosition, scene: this.scene, name: "Succinato" });
                succinato.isGot = true;
                this.scene.friendStars.push(succinato);
                this.scene.friendStars.push(this.gtp);

                this.end();
            }
        });
    }

    end() {
        endAnimation(this.scene);
    }
}