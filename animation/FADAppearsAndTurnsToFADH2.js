import { BLOCK_SIZE, CANVA_HEIGHT, CANVA_WIDTH } from "../game/Config.js";
import { endAnimation, startAnimation } from "./AnimationHub.js";
import { Star } from "../game/item/Star.js";

export class FADAppearsAndTurnsToFADH2 {
    constructor() {
        this.scene;
        this.fad;
        this.succinato;
        this.fadh2;
        this.h2;
        this.crossingPoint1Y;
        this.crossingPoint2Y;
        this.finalPointY;
    }
    animate(scene, gotEventPoint) {
        this.scene = scene;
        this.succinato = this.scene.friendStars[0];
        startAnimation(scene, gotEventPoint).then(() => {
            this.begin();
        });
    }
    begin() {

        this.crossingPoint1Y = this.scene.player.y - this.scene.player.height * 1;
        this.crossingPoint2Y = this.scene.player.y - this.scene.player.height * 2;
        this.finalPointY = this.scene.player.y - (3 * this.scene.player.height);

        this.fad = new Star({ x: this.scene.player.x + CANVA_WIDTH, y: -CANVA_HEIGHT, scene: this.scene, name: "FAD" });
        this.fadAppears();
    }

    fadAppears() {

        this.scene.tweens.add({
            targets: this.fad,
            x: this.succinato.x - BLOCK_SIZE,
            y: this.succinato.y - BLOCK_SIZE,
            duration: 2000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.scene.cameras.main.zoomTo(2, 1000);
                this.fadTakes2h();
            }
        });

    }

    fadTakes2h() {
        this.h2 = new Star({ x: this.succinato.x, y: this.succinato.y, scene: this.scene, name: "2H" });
        this.h2.setScale(0.5)
        this.isGot = true;
        this.scene.tweens.add({
            targets: this.h2,
            x: this.fad.x - BLOCK_SIZE,
            y: this.fad.y - BLOCK_SIZE,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.event1();
            }
        });
    }

    event1() {
        this.scene.tweens.add({
            targets: this.fad,
            x: this.scene.player.x + BLOCK_SIZE + 16,
            y: this.crossingPoint1Y,
            duration: 1000,
            ease: 'Sine.easeOut',
        });

        this.scene.tweens.add({
            targets: this.h2,
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
            targets: this.fad,
            x: this.scene.player.x - BLOCK_SIZE + 16,
            y: this.crossingPoint2Y,
            duration: 1000,
            ease: 'Sine.easeOut'
        });

        this.scene.tweens.add({
            targets: this.h2,
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
            targets: this.fad,
            x: this.scene.player.x,
            y: this.finalPointY,
            duration: 1000,
            ease: 'Sine.easeOut'
        });

        this.scene.tweens.add({
            targets: this.h2,
            x: this.scene.player.x,
            y: this.finalPointY,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.createfadh2();
            }
        });
    }

    createfadh2() {
        const glow = this.scene.add.circle(this.fad.x, this.fad.y, 20, 0xfffffffff).setAlpha(0);

        this.scene.tweens.add({
            targets: glow,
            alpha: 0.8,
            scale: 100,
            duration: 200,
            yoyo: true,
            onComplete: () => {
                this.scene.cameras.main.zoomTo(1, 1000);

                this.fad.destroy();
                this.fad.name.destroy();
                this.h2.destroy();
                this.h2.name.destroy();

                this.fadh2 = new Star({ x: this.fad.x, y: this.fad.y, scene: this.scene, name: "FADH2" });
                this.fadh2.isGot = true;
                setTimeout(() => {
                    this.fadGoAway();
                }, 1000);

            }
        });
    }

    fadGoAway() {
        this.scene.tweens.add({
            targets: this.fadh2,
            x: this.scene.player.x + CANVA_WIDTH,
            y: -CANVA_HEIGHT,
            duration: 2000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.end();
            }
        });
    }

    end() {
        endAnimation(this.scene);
    }
}