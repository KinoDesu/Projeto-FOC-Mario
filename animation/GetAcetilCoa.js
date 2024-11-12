import { completeAnimation } from "./AnimationHub.js";

export class GetAcetilCoa {
    constructor() {
        this.gotEventPoint;
    }

    animate(scene, gotEventPoint) {

        if (scene.friendStars.length === 0) {
            return;
        }

        completeAnimation(scene, gotEventPoint);
    }
}