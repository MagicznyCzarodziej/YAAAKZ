import 'phaser';

enum AmmoType {
  BULLET = 'bullet',
  PELLET = 'pellet',
};

type WeaponConfig = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  sprite: string;
  shotSound: string;
  reloadSound: string;
  displayName: string;
  offsetX: number;
  offsetY: number;
  spread: number
  delay: number;
  reloadTime: number;
  ammoType: AmmoType;
  maxMags: number;
  magCapacity: number;
  ammo: number;
};

export abstract class Weapon extends Phaser.GameObjects.Sprite implements WeaponConfig{
  scene: Phaser.Scene;
  x: number;
  y: number;
  sprite: string;
  shotSound: string;
  reloadSound: string;
  displayName: string;
  offsetX: number;
  offsetY: number;
  spread: number;
  delay: number;
  reloadTime: number;
  ammoType: AmmoType;
  maxMags: number;
  magCapacity: number;
  ammo: number = 0;

  constructor(config: WeaponConfig) {
    super(config.scene, config.x, config.y, config.sprite);
    Object.assign(this, config);

    this.setOrigin(0);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this, false);
    this.scene.physics.world.enableBody(this, 0);
  }
}

export class M4 extends Weapon {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super({
      scene: scene,
      x: x,
      y: y,
      sprite: 'weapon_M4',
      shotSound: 'weapon_M4_shot',
      reloadSound: '',
      displayName: 'Karabin M4',
      offsetX: 35,
      offsetY: 5,
      spread: 2,
      delay: 100,
      reloadTime: 1000,
      ammoType: AmmoType.BULLET,
      maxMags: 5,
      magCapacity: 30,
      ammo: 150,
    });
  }
}