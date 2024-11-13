import { endAnimation, startAnimation } from "./AnimationHub.js";

export class GetAcetilCoa {
    constructor() {
        this.gotEventPoint;
    }

    animate(scene, gotEventPoint) {

        if (scene.friendStars.length === 0) {
            return;
        }

        startAnimation(scene, gotEventPoint).then(() => {
            endAnimation(scene);
        });
    }
}