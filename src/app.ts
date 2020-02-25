import 'phaser';
import MainScene from './Mainscene';

const ganeConfig: Phaser.Types.Core.GameConfig = {
  title: "YAAAKZ",
  width: 1000,
  height: 600,
  parent: "game",
  scene: [MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  backgroundColor: "#999999",
};

export class YAAAKZ extends Phaser.Game {
  constructor(config) {
    super(config);
  }
}

window.onload = () => {
  const game = new YAAAKZ(ganeConfig);
};