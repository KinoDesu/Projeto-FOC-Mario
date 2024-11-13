import { DOOR_WIDTH } from "../game/Config.js";
import { endAnimation, startAnimation } from "./AnimationHub.js";
import { WinScene } from "../game/scene/WinScene.js";

export class EnterTheDoor {
    constructor() {
        this.scene;
    }

    animate(scene, gotEventPoint) {

        this.scene = scene;

        startAnimation(scene, gotEventPoint).then(() => {
            this.scene.player.setVelocityX(160);

            let run = false;

            this.scene.events.on('update', () => {

                if ((this.scene.physics.overlap(this.scene.player, this.scene.door)) && !run) {
                    run = true;
                    this.begin();
                }
            });
        });
    }

    begin() {
        this.scene.player.setVelocityX(0);
        let door1 = this.scene.physics.add.sprite(this.scene.door.x, this.scene.door.y, 'portaAberta');
        this.scene.add.existing(door1);
        this.scene.physics.add.existing(door1);
        door1.body.setAllowGravity(false);

        this.scene.tweens.add({
            targets: this.scene.player,
            x: this.scene.door.x + DOOR_WIDTH - 60,
            duration: 2000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.scene.scene.add('WinScene', WinScene);
                this.scene.scene.launch('WinScene');
                this.scene.scene.remove('Level');
            }
        });
    }

    end() {
        endAnimation(this.scene);
    }
}