import { BLOCK_SIZE, CANVA_HEIGHT, CANVA_WIDTH } from "../game/Config.js";
import { endAnimation, startAnimation } from "./AnimationHub.js";
import { Star } from "../game/item/Star.js";

export class NADAppearsStealAndTurnsToNADHH {
    constructor() {
        this.scene;
        this.malato;
        this.nad;
        this.nadhh;
        this.h2;
        this.crossingPoint1Y;
        this.crossingPoint2Y;
        this.finalPointY;
    }

    animate(scene, gotEventPoint) {

        this.scene = scene;
        this.malato = this.scene.friendStars[0];

        this.crossingPoint1Y = this.scene.player.y - this.scene.player.height * 1;
        this.crossingPoint2Y = this.scene.player.y - this.scene.player.height * 2;
        this.finalPointY = this.scene.player.y - (3 * this.scene.player.height);

        startAnimation(scene, gotEventPoint).then(() => {
            this.begin();
        });
    }

    begin() {
        this.nad = new Star({ x: this.scene.player.x + CANVA_WIDTH, y: -CANVA_HEIGHT, scene: this.scene, name: "NAD" });
        this.nadAppears();
    }

    nadAppears() {

        this.scene.tweens.add({
            targets: this.nad,
            x: this.malato.x - BLOCK_SIZE,
            y: this.malato.y - BLOCK_SIZE,
            duration: 2000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.nadTakes2h();
            }
        });

    }

    nadTakes2h() {
        this.h2 = new Star({ x: this.malato.x, y: this.malato.y, scene: this.scene, name: "2H" });
        this.h2.setScale(0.5);
        this.h2.isGot = true;
        this.scene.tweens.add({
            targets: this.h2,
            x: this.nad.x - BLOCK_SIZE,
            y: this.nad.y - BLOCK_SIZE,
            duration: 2000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.event1();
            }
        });
    }

    event1() {
        this.scene.tweens.add({
            targets: this.nad,
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
            targets: this.nad,
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
            targets: this.nad,
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
                this.nadTurnsToNadHH();
            }
        });
    }

    nadTurnsToNadHH() {
        const glow = this.scene.add.circle(this.nad.x, this.nad.y, 20, 0xfffffffff).setAlpha(0);

        this.scene.tweens.add({
            targets: glow,
            alpha: 0.75,
            scale: 100,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                this.nad.destroy();
                this.nad.name.destroy();
                this.h2.destroy();
                this.h2.name.destroy();

                this.nadhh = new Star({ x: this.nad.x, y: this.nad.y, scene: this.scene, name: "NADH+H+" });
                this.nadhh.isGot = true;

                setTimeout(() => {
                    this.nadGoAway();
                }, 1000);
            }
        });
    }

    nadGoAway() {
        this.scene.tweens.add({
            targets: this.nadhh,
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