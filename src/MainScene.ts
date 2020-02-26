import 'phaser';
import Player from './Player';

export default class MainScene extends Phaser.Scene {
  private player: Player; 
  private walls: Phaser.Physics.Arcade.StaticGroup;
  private map: Phaser.Tilemaps.Tilemap;

  constructor() { 
    super({
      key: 'MainScene',
    });
  }

  preload(): void {
    this.load.image('player', 'assets/player2.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.image('ground', 'assets/ground2.png');
    this.load.tilemapTiledJSON('map', 'map.json');
  }

  create() {
    this.cameras.main.setZoom(2);

    this.map = this.add.tilemap("map");
    const tileset = this.map.addTilesetImage('ground', 'ground');
    const layer = this.map.createStaticLayer('layer01', tileset);

    this.createPlayer();

    // Wrap world for the player
    const mapWidth = this.map.width*this.map.tileWidth;
    const mapHeight = this.map.height*this.map.tileHeight;
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.physics.add.collider(this.player, this.walls);

    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

    this.input.setDefaultCursor('crosshair');
  }

  update() {
    this.physics.world.wrap(this.player, 5);

    this.moveCamera();
    this.player.update();
  }

  createPlayer() {
    this.player = new Player({
      scene: this,
      x: 600,
      y: 600,
      sprite: 'player',
    });
  }

  moveCamera() {
    // Following the player and looking around with mouse
    let distX = this.cameras.main.centerX - this.input.mousePointer.x;
    let distY = this.cameras.main.centerY - this.input.mousePointer.y;
    const offset = new Phaser.Math.Vector2(distX, distY); // Distance between player and mouse
    if (offset.length() > 400) offset.normalize().scale(100);
    else offset.scale(0.25);
    this.cameras.main.setFollowOffset(offset.x, offset.y);
  }
};