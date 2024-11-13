import { CANVA_WIDTH, CANVA_HEIGHT } from '../Config.js'
import { activeControls } from "../Game.js";
import { MainMenuScene } from './MainMenuScene.js';
export class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
        this.selectedOption = 0;
        this.messages = ["Você ganhou!", "Espero que esse jogo te ajude a entender o ciclo de Krebs"];
    }

    preload() {
    }

    create() {
        activeControls(this);
        this.cameras.main.setBackgroundColor('#FFF')

        let margin = 2;
        const availableWidht = CANVA_WIDTH - 2 * margin;
        const title = this.add.text(CANVA_WIDTH / 2, 0, "Parabéns!!", {
            fontSize: `52px`,
            fill: '#c472e0',
            align: 'center',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 6
        });

        let posY = margin + title.height;
        title.y = posY;
        posY += title.height + 10;
        title.setOrigin(0.5);
        title.setWordWrapWidth(availableWidht);



        this.messages.forEach((message, index) => {
            let fontSize = 52;
            let textObj;

            do {
                if (textObj) textObj.destroy();
                textObj = this.add.text(CANVA_WIDTH / 2, 0, message, {
                    fontSize: `${fontSize}px`,
                    align: 'center',
                    color: '#000',
                    fontFamily: 'Arial',
                    fontStyle: 'bold'
                })
                fontSize -= 1;
            } while (textObj.width > availableWidht && fontSize >= 24);

            textObj.y = posY;
            posY += textObj.height + 10;

            textObj.setOrigin(0.5);
            textObj.setWordWrapWidth(availableWidht - margin);
        });

        this.options = this.options = [
            this.add.text(CANVA_WIDTH / 2, CANVA_HEIGHT / 2 + 100, 'Sair', {
                fontSize: '32px',
                color: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5)
        ];

        this.options.forEach((option, index) => {
            let fontSize = 52;
            let textObj;

            do {
                if (textObj) textObj.destroy();
                textObj = this.add.text(CANVA_WIDTH / 2, CANVA_HEIGHT / 2 + 100, option.text, {
                    fontSize: '32px',
                    color: '#ffffff',
                    fontFamily: 'Arial',
                    fontStyle: 'bold'
                }).setOrigin(0.5, 0.5)
                fontSize -= 1;
            } while (textObj.width > availableWidht && fontSize >= 24);

            textObj.y = posY;
            posY += textObj.height + 10;

            textObj.setOrigin(0.5);
            textObj.setWordWrapWidth(availableWidht - margin);
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
                option.setColor('#fff');
                option.setStroke('#000', 6)
            } else {
                option.setColor('#000');
                option.setStroke('#000', 0)
            }
        });
    }

    selectOption() {

        this.scene.add('MainMenuScene', MainMenuScene);
        this.scene.start('MainMenuScene');
        this.scene.remove("Level");
        this.scene.remove("WinScene");
    }
    goBack() {
        this.scene.add('MainMenuScene', MainMenuScene);
        this.scene.start('MainMenuScene');
        this.scene.remove("Level");
        this.scene.remove("WinScene");
    }
}