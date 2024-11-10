import { CANVA_WIDTH, CANVA_HEIGHT } from '../Config.js'
import { activeControls } from "../Game.js";
export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
        this.selectedOption = 0;
    }

    preload() {
    }

    create() {
        activeControls(this);
        this.cameras.main.setBackgroundColor('#FFF')
        this.add.text(CANVA_WIDTH / 2, CANVA_HEIGHT / 2 - 50, 'Mario', { fontSize: '64px', fill: '#ff2f3f', align: 'center', fontFamily: 'Arial', fontStyle: 'bold', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5, 0.5);
        this.add.text(CANVA_WIDTH / 2, CANVA_HEIGHT / 2 + 10, 'Ciclo de Krebs', { fontSize: '64px', fill: '#c472e0', align: 'center', fontFamily: 'Arial', fontStyle: 'bold', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5, 0.5);

        this.options = [
            this.add.text(CANVA_WIDTH / 2, CANVA_HEIGHT / 2 + 100, 'Começar', {
                fontSize: '32px',
                color: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5),
            // this.add.text(CANVA_WIDTH / 2, CANVA_HEIGHT / 2 + 150, 'Quem somos nós?', {
            //     fontSize: '32px',
            //     color: '#ffffff',
            //     fontFamily: 'Arial',
            //     fontStyle: 'bold'
            // }).setOrigin(0.5, 0.5)
        ];

        this.add.text(10, CANVA_HEIGHT / 2 + 190, 'W / ▲ - Mover para cima', { fontSize: '16px', fill: '#000', align: 'left', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5);
        this.add.text(10, CANVA_HEIGHT / 2 + 215, 'S / ▼ - Mover para cima', { fontSize: '16px', fill: '#000', align: 'center', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5);
        this.add.text(10, CANVA_HEIGHT / 2 + 240, 'ESPAÇO / B - Confirmar', { fontSize: '16px', fill: '#000', align: 'center', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5);
        this.updateSelectedOption();

        this.input.keyboard.on('keydown-W', this.moveUp, this);
        this.input.keyboard.on('keydown-S', this.moveDown, this);
        this.input.keyboard.on('keydown-SPACE', this.selectOption, this);
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
        if (this.selectedOption === 0) {
            this.scene.start('Level');
            this.scene.stop()
        } else if (this.selectedOption === 1) {
            this.scene.start('MemberScene');
            this.scene.stop()
        }
    }
}