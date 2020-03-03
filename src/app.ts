import 'phaser';
import MainScene from './Mainscene';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "YAAAKZ",
  width: 1984,
  height: 1984,
  scale: {
    mode: Phaser.Scale.RESIZE,
  },
  parent: "game",
  scene: [MainScene],
  physics: {
    default: 'matter',
    matter: {
      gravity: false,
      debug: {
        showBody: false,
        showStaticBody: false,
      }
    },
  },
  render: {
    pixelArt: true,
  },
  backgroundColor: "#999999",
};

export class YAAAKZ extends Phaser.Game {
  constructor(config) {
    super(config);
  }
}

window.onload = () => {
  const game = new YAAAKZ(gameConfig);
};