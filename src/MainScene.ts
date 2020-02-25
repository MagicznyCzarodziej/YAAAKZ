import 'phaser';
import Player from './Player';

export default class MainScene extends Phaser.Scene {
  private player: Player; 
  private walls: Phaser.Physics.Arcade.StaticGroup;
  
  constructor() { 
    super({
      key: 'MainScene',
    });
  }

  preload(): void {
    this.load.image('player', 'assets/player.png');
    this.load.image('wall', 'assets/wall.png');
  }

  create() {
    this.walls = this.physics.add.staticGroup({
      key: "wall",
    });

    this.player = new Player({
      scene: this,
      x: 200,
      y: 200,
      sprite: 'player',
    });

    this.physics.add.collider(this.player, this.walls);
  }

  update() {
    this.physics.world.wrap(this.player, 5);

    this.player.update();
  }
};