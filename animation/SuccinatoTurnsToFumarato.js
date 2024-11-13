import { BLOCK_SIZE } from "../game/Config.js";
import { endAnimation, startAnimation } from "./AnimationHub.js";
import { Star } from "../game/item/Star.js";

export class SuccinatoTurnsToFumarato {
    constructor() {
        this.scene;
        this.succinato;
        this.finalXPosition
        this.finalYPosition
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

        this.succinato = new Star({ x: this.scene.friendStars[0].x, y: this.scene.friendStars[0].y, scene: this.scene, name: "Succinato" });
        this.succinato.isGot = true;

        this.succinatoGoUp();
    }

    succinatoGoUp() {
        this.scene.cameras.main.zoomTo(2, 1000);
        this.scene.tweens.add({
            targets: this.succinato,
            x: this.scene.player.x,
            y: this.finalYPosition,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.succinatoTurnsToFumarato();
            }
        });
    }

    succinatoTurnsToFumarato() {
        const glow = this.scene.add.circle(this.succinato.x, this.succinato.y, 20, 0xfffffffff).setAlpha(0);

        this.scene.tweens.add({
            targets: glow,
            alpha: 0.75,
            scale: 100,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                this.scene.cameras.main.zoomTo(1, 1000);
                this.succinato.destroy();
                this.succinato.name.destroy();

                this.scene.friendStars = [];
                this.fumarato = new Star({ x: this.succinato.x, y: this.succinato.y, scene: this.scene, name: "Fumarato" });
                this.fumarato.isGot = true;
                this.scene.friendStars.push(this.fumarato);

                this.end();
            }
        });
    }

    end() {
        endAnimation(this.scene);
    }
}