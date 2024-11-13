import { GetAcetilCoa } from "./GetAcetilCoa.js"
import { AcetilAndOxalatoToCitrato } from "./AcetilAndOxalatoToCitrato.js"
import { LoseH2OTurnsToCisAconitato } from "./LoseH2OTurnsToCisAconitato.js"
import { FindH2O } from "./FindH2O.js"
import { TurnsToIsocitrato } from "./TurnsToIsocitrato.js"
import { FreeCO2AndTurnsToAlfaCetoglutarato } from "./FreeCO2AndTurnsToAlfaCetoglutarato.js"
import { FreeNADH } from "./FreeNADH.js"
import { FreeCO2AndTurnsToSuccinilCoa } from "./FreeCO2AndTurnsToSuccinilCoa.js"
import { LoseCoaAndTurnsToSuccinato } from "./LoseCoaAndTurnsToSuccinato.js"

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
    for (const eventPoint of scene.eventPoints) {
        if (eventPoint.x == gotEventPoint.x) {
            eventPoint.destroy();
        }
    }

}
export const animations = [
    new GetAcetilCoa(),
    new AcetilAndOxalatoToCitrato(),
    new LoseH2OTurnsToCisAconitato(),
    new FindH2O(),
    new TurnsToIsocitrato(),
    new FreeCO2AndTurnsToAlfaCetoglutarato(),
    new FreeNADH(),
    new FreeCO2AndTurnsToSuccinilCoa(),
    new LoseCoaAndTurnsToSuccinato(),
    //new FADAppearsAndTurnsToFADH2(),
    //new SuccinatoTurnsToFumarato(),
    //new LoseOHWinHAndTurnsToMalato(),
    //new NADAppearsStealAndTurnsToNADHH(),
    //new MalatoTurnsToOxaloacetato(),
    //new EnterTheDoor()
]

export function startAnimation(scene, gotEventPoint) {
    if (gotEventPoint) {

        scene.enemies.forEach((e) => {
            if (e.active) {
                e.lastVelocity = e.body.velocity.x;
                e.setVelocityX(0);
            }
        });
        scene.animationEvent = true;
        scene.player.setVelocityX(0);
        scene.player.setVelocity(0);

        gotEventPoint.isGot = true;
        removeInvisibleBlock(scene, gotEventPoint);
        removeRemainingEventPoint(scene, gotEventPoint);

        return waitPlayerTouchesFloor(scene);
    }
}

export function endAnimation(scene) {
    scene.animationEvent = false;
    scene.enemies.forEach((e) => {
        if (e.active) {
            e.setVelocityX(e.lastVelocity);
        }
    });
}

function waitPlayerTouchesFloor(scene) {
    return new Promise((resolve) => {
        const checkFloor = () => {
            let touching = scene.player.touchingFloor;
            if (touching) {
                resolve();
            } else {
                scene.player.scene.time.delayedCall(16, checkFloor);
            }
        };
        checkFloor();
    });
}
