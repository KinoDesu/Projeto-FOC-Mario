import { BLOCK_SIZE } from "../game/Config.js";
import { endAnimation, startAnimation } from "./AnimationHub.js";
import { Star } from "../game/item/Star.js";

export class TurnsToIsocitrato {
    constructor() {
        this.scene;
        this.cisAconitato;
        this.water;
        this.isocitrato;
        this.crossingPoint1Y;
        this.crossingPoint2Y;
        this.finalPointY;
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

        this.crossingPoint1Y = this.scene.player.y - this.scene.player.height * 1;
        this.crossingPoint2Y = this.scene.player.y - this.scene.player.height * 2;
        this.finalPointY = this.scene.player.y - (3 * this.scene.player.height);

        this.scene.friendStars.forEach((star) => {
            if (star.active) {
                star.destroy();
                star.name.destroy();
            }
        })

        this.cisAconitato = new Star({ x: this.scene.friendStars[0].x, y: this.scene.friendStars[0].y, scene: this.scene, name: "Cis-Aconitato" });
        this.cisAconitato.isGot = true;

        this.water = new Star({ x: this.scene.friendStars[1].x, y: this.scene.friendStars[1].y, scene: this.scene, name: "H₂O" });
        this.water.isGot = true;

        this.cisAconitatoAndWaterGetsDistance();
    }

    cisAconitatoAndWaterGetsDistance() {
        this.scene.cameras.main.zoomTo(2, 1000);

        this.scene.tweens.add({
            targets: this.cisAconitato,
            x: this.scene.player.x + BLOCK_SIZE + 16,
            y: this.scene.player.y,
            duration: 500,
            ease: 'Sine.easeOut',
        });

        this.scene.tweens.add({
            targets: this.water,
            x: this.scene.player.x - BLOCK_SIZE + 16,
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
            targets: this.cisAconitato,
            x: this.scene.player.x + BLOCK_SIZE + 16,
            y: this.crossingPoint1Y,
            duration: 1000,
            ease: 'Sine.easeOut',
        });

        this.scene.tweens.add({
            targets: this.water,
            x: this.scene.player.x - BLOCK_SIZE + 16,
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
            targets: this.cisAconitato,
            x: this.scene.player.x - BLOCK_SIZE + 16,
            y: this.crossingPoint2Y,
            duration: 1000,
            ease: 'Sine.easeOut'
        });

        this.scene.tweens.add({
            targets: this.water,
            x: this.scene.player.x + BLOCK_SIZE + 16,
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
            targets: this.cisAconitato,
            x: this.scene.player.x,
            y: this.finalPointY,
            duration: 1000,
            ease: 'Sine.easeOut'
        });

        this.scene.tweens.add({
            targets: this.water,
            x: this.scene.player.x,
            y: this.finalPointY,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.createIsocitrato();
            }
        });
    }

    createIsocitrato() {
        const glow = this.scene.add.circle(this.cisAconitato.x, this.cisAconitato.y, 20, 0xfffffffff).setAlpha(0);

        this.scene.tweens.add({
            targets: glow,
            alpha: 0.8,
            scale: 100,
            duration: 200,
            yoyo: true,
            onComplete: () => {
                this.scene.cameras.main.zoomTo(1, 1000);

                this.cisAconitato.destroy();
                this.cisAconitato.name.destroy();
                this.water.destroy();
                this.water.name.destroy();

                this.scene.friendStars = [];
                const citrato = new Star({ x: this.scene.player.x, y: this.finalPointY, scene: this.scene, name: "Isocitrato" });
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