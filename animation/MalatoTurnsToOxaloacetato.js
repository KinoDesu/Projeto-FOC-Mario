import { BLOCK_SIZE } from "../game/Config.js";
import { endAnimation, startAnimation } from "./AnimationHub.js";
import { Star } from "../game/item/Star.js";

export class MalatoTurnsToOxaloacetato {
    constructor() {
        this.scene;
        this.malato;
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

        this.malato = new Star({ x: this.scene.friendStars[0].x, y: this.scene.friendStars[0].y, scene: this.scene, name: "Malato" });
        this.malato.isGot = true;

        this.malatoGoUp();
    }

    malatoGoUp() {
        this.scene.cameras.main.zoomTo(2, 1000);
        this.scene.tweens.add({
            targets: this.malato,
            x: this.scene.player.x,
            y: this.finalYPosition,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.malatoTurnsToOxaloacetato();
            }
        });
    }

    malatoTurnsToOxaloacetato() {
        const glow = this.scene.add.circle(this.malato.x, this.malato.y, 20, 0xfffffffff).setAlpha(0);

        this.scene.tweens.add({
            targets: glow,
            alpha: 0.75,
            scale: 100,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                this.scene.cameras.main.zoomTo(1, 1000);
                this.malato.destroy();
                this.malato.name.destroy();

                this.scene.friendStars = [];
                const oxaloacetato = new Star({ x: this.malato.x, y: this.malato.y, scene: this.scene, name: "Oxaloacetato" });
                oxaloacetato.isGot = true;
                this.scene.friendStars.push(oxaloacetato);

                this.end();
            }
        });
    }

    end() {
        endAnimation(this.scene);
    }
}