import 'phaser';

enum AmmoType {
  BULLET = 'bullet',
  PELLET = 'pellet',
};

export default interface Weapon {
  sprite: string;
  shotSound: string;
  reloadSound: string;
  displayName: string;
  bulletX: number;
  bulletY: number;
  offsetX: number;
  offsetY: number;
  spread: number
  shakeIntensity: number;
  recoil: number;
  delay: number;
  reloadTime: number;
  ammoType: AmmoType;
  maxMags: number;
  magCapacity: number;
  currentMag: number;
  mags: number;
  damage: number;
}

export class M4 implements Weapon {
  public sprite = 'weapon_M4';
  public shotSound = 'weapon_M4_shot';
  public reloadSound = '';
  public displayName = 'Karabin M4';
  public bulletX = 51;
  public bulletY = 6;
  public offsetX = 3;
  public offsetY = 2;
  public spread = 2.5;
  public shakeIntensity = 0.0008;
  public recoil = 0.0002;
  public delay = 110;
  public reloadTime = 3000;
  public ammoType = AmmoType.BULLET;
  public maxMags = 5;
  public magCapacity = 30;
  public currentMag = 30;
  public mags = 3;
  public damage = 30;
}

export class SMG implements Weapon {
  public sprite = 'weapon_SMG';
  public shotSound = 'weapon_M4_shot';
  public reloadSound = '';
  public displayName = 'SMG';
  public bulletX = 51;
  public bulletY = 6;
  public offsetX = 7;
  public offsetY = 0;
  public spread = 4;
  public shakeIntensity = 0.0006;
  public recoil = 0.0001;
  public delay = 50;
  public reloadTime = 1000;
  public ammoType = AmmoType.BULLET;
  public maxMags = 4;
  public magCapacity = 20;
  public currentMag = 20;
  public mags = 4;
  public damage = 10;
}