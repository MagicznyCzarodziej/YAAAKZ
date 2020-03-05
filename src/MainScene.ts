import 'phaser';
import Player from './Player';

export default class MainScene extends Phaser.Scene {
  public player//: Player; 
  //private walls: Phaser.Physics.Arcade.StaticGroup;
  private map: Phaser.Tilemaps.Tilemap;
  public bullets: Phaser.GameObjects.Group;
  private layer02;
  public ammoText: Phaser.GameObjects.Text;
  constructor() { 
    super({
      key: 'MainScene',
    });
  }

  preload(): void {
    this.load.image('player', 'assets/player.png');
    this.load.image('wall', 'assets/wall2.png');
    this.load.image('ground', 'assets/ground2.png')
    this.load.tilemapTiledJSON('map', 'map.json');

    // Weapons
    this.load.image('weapon_M4', 'assets/weapon_M4.png');
    this.load.image('weapon_SMG', 'assets/weapon_SMG.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.audio('weapon_M4_shot', 'assets/weapon_M4_shot.wav');
  }

  create() {
    this.cameras.main.setZoom(2);
    
    this.map = this.add.tilemap("map");
    const ground = this.map.addTilesetImage('ground', 'ground', 32, 32, 1, 2);
    const wall = this.map.addTilesetImage('wall', 'wall');
    const layer01 = this.map.createStaticLayer('layer01', ground);
    this.layer02 = this.map.createDynamicLayer('layer02', wall);
    this.createPlayer();
    this.map.setCollisionByExclusion([-1], true, true, this.layer02);
    this.matter.world.convertTilemapLayer(this.layer02);
    
    // Wrap world for the player
    const mapWidth = this.map.width*this.map.tileWidth;
    const mapHeight = this.map.height*this.map.tileHeight;
    
    this.cameras.main.startFollow(this.player.container, true, 0.05, 0.05);
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    
    this.input.setDefaultCursor('crosshair');
    this.input.mouse.disableContextMenu();
    this.bullets = this.add.group();
    
    this.ammoText = this.add.text(400, 640, 'Amunicja').setScrollFactor(0);
  }

  update(time, deltaTime) {
    this.moveCamera();
    this.player.update(deltaTime);
  }

  createPlayer() {
    this.player = new Player(this, 600, 600, 'player');
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