import { CANVA_WIDTH, CANVA_HEIGHT } from '../Config.js'
import { activeControls } from "../Game.js";
import { members } from "../item/Members.js";
export class MembersListScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MembersListScene' });
        this.selectedOption = 0;
    }

    preload() {
    }

    create() {
        activeControls(this);
        this.cameras.main.setBackgroundColor('#FFF')

        let margin = 2;
        const availableWidht = CANVA_WIDTH - 2 * margin;
        const title = this.add.text(CANVA_WIDTH / 2, 0, "Membros do time", {
            fontSize: `52px`,
            fill: '#c472e0',
            align: 'center',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 6
        });

        const posY = margin + title.height / 1.5;
        title.y = posY;
        title.setOrigin(0.5);
        title.setWordWrapWidth(availableWidht);

        this.options = [];


        members.forEach((member, index) => {
            let fontSize = 52;
            let textObj;

            do {
                if (textObj) textObj.destroy();
                textObj = this.add.text(CANVA_WIDTH / 2, 0, member.name, {
                    fontSize: `${fontSize}px`,
                    align: 'center',
                    color: '#000',
                    fontFamily: 'Arial',
                    fontStyle: 'bold'
                })
                fontSize -= 1;
            } while (textObj.width > availableWidht && fontSize >= 24);

            const posY = (margin + (index + 1) * textObj.height) + textObj.height;
            textObj.y = posY;

            textObj.setOrigin(0.5);
            textObj.setWordWrapWidth(availableWidht - margin);
            this.options.push({
                textObj: textObj,
                member: member
            });
        });

        this.add.text(10, CANVA_HEIGHT / 2 + 215, 'ESPAÇO / B - Confirmar', { fontSize: '16px', fill: '#000', align: 'center', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5);
        this.add.text(10, CANVA_HEIGHT / 2 + 240, 'ESC / A - Voltar', { fontSize: '16px', fill: '#000', align: 'center', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5);
        this.updateSelectedOption();

        this.input.keyboard.on('keydown-W', this.moveUp, this);
        this.input.keyboard.on('keydown-S', this.moveDown, this);
        this.input.keyboard.on('keydown-SPACE', this.selectOption, this);
        this.input.keyboard.on('keydown-ESC', this.goBack, this);
    }

    moveUp() {
        this.selectedOption = (this.selectedOption > 0) ? this.selectedOption - 1 : this.options.length - 1;
        this.updateSelectedOption();
    }

    moveDown() {
        this.selectedOption = (this.selectedOption < this.options.length - 1) ? this.selectedOption + 1 : 0;
        this.updateSelectedOption();
    }

    updateSelectedOption() {
        this.options.forEach((option, index) => {
            if (index === this.selectedOption) {
                option.textObj.setColor('#fff');
                option.textObj.setStroke('#000', 6)
            } else {
                option.textObj.setColor('#000');
                option.textObj.setStroke('#000', 0)
            }
        });
    }

    selectOption() {
        this.scene.start('MemberDetailScene', { member: this.options[this.selectOption].member });
    }

    goBack() {
        this.scene.start('MainMenuScene');
    }
}