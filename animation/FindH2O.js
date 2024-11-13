import { endAnimation, startAnimation } from "./AnimationHub.js";

export class FindH2O {
    constructor() {
        this.scene
    }
    animate(scene, gotEventPoint) {
        this.scene = scene;
        startAnimation(scene, gotEventPoint).then(() => {
            this.begin();
        });
    }

    begin() {
        this.zoomIn();
    }

    zoomIn() {
        this.scene.cameras.main.pan(this.scene.stars[0].x, this.scene.stars[0].y, 2000, 'Sine.easeInOut');
        this.scene.cameras.main.zoomTo(2, 2000, 'Sine.easeInOut', true);
        this.scene.time.delayedCall(2000, () => {
            this.scene.cameras.main.pan(this.scene.player.x, this.scene.player.y, 2000, 'Sine.easeInOut');
            this.scene.cameras.main.zoomTo(1, 2000, 'Sine.easeInOut');
            this.scene.time.delayedCall(2000, () => {
                this.end();
            });
        });
    }
    end() {
        endAnimation(this.scene);
    }
}