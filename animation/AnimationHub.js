import { AcetilAndOxalatoToCitrato } from "./AcetilAndOxalatoToCitrato.js"
import { GetAcetilCoa } from "./GetAcetilCoa.js"

function removeInvisibleBlock(scene, gotEventPoint) {
    let closestDistance = Infinity;
    let closestBlock = null;

    for (const invisibleBlock of scene.blockingBlocks) {
        const distance = Math.abs(gotEventPoint.x - invisibleBlock.x);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestBlock = invisibleBlock;
        }
    }

    if (closestBlock) {
        for (const invisibleBlock of scene.blockingBlocks) {
            if (invisibleBlock.x == closestBlock.x) {
                invisibleBlock.destroy();
            }
        }

    }
}

function removeRemainingEventPoint(scene, gotEventPoint) {
    console.log(scene);


    for (const eventPoint of scene.eventPoints) {
        if (eventPoint.x == gotEventPoint.x) {
            eventPoint.destroy();
        }
    }

}
export const animations = [
    new GetAcetilCoa(),
    new AcetilAndOxalatoToCitrato()
]

export function completeAnimation(scene, gotEventPoint) {
    console.log(gotEventPoint);

    if (gotEventPoint) {
        gotEventPoint.isGot = true;
        removeInvisibleBlock(scene, gotEventPoint);
        removeRemainingEventPoint(scene, gotEventPoint);
    }
}
