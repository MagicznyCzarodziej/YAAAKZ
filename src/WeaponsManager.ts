import Weapon, { M4, SMG } from "./Weapon";
import Bullet from './Bullet';
import MainScene from "./MainScene";

export default class WeaponsManager {
  public reloading = false;
  private reloadingTimer: Phaser.Time.TimerEvent;
  private waiting = false; // For dalay between shots
  private selectedWeapon: Weapon;
  private weapons: Weapon[] = [];
  public sprite: Phaser.GameObjects.Image;
  public MOVING_SPREAD_MODIFIER = 1.5;

  get bulletX() {
    return this.selectedWeapon.bulletX;
  }

  get bulletY() {
    return this.selectedWeapon.bulletY;
  }

  get spread() {
    return this.selectedWeapon.spread;
  }

  get recoil() {
    return this.selectedWeapon.recoil;
  }

  get canShoot() {
    return ((!this.reloading) && (this.selectedWeapon.currentMag > 0));
  }
  
  constructor(private scene: MainScene) {
    this.weapons.push(new M4());
    this.weapons.push(new SMG());
    this.selectedWeapon = this.weapons[0];
    this.sprite = new Phaser.GameObjects.Image(
      scene,
      this.selectedWeapon.offsetX,
      this.selectedWeapon.offsetY,
      this.selectedWeapon.sprite,
    );
    this.sprite.setOrigin(0,0);
  }

  switchWeapon(index: number) {
    if (!this.weapons[index]) return;

    this.selectedWeapon = this.weapons[index];
    this.sprite.setTexture(this.selectedWeapon.sprite);
    this.sprite.setPosition(this.selectedWeapon.offsetX, this.selectedWeapon.offsetY);
    this.scene.ammoText.setText(this.selectedWeapon.currentMag.toString());
  }

  shoot(x: number, y: number, angleRad: number) {
    if (this.waiting || this.reloading) return;
    
    if (this.selectedWeapon.currentMag <= 0) {
      this.reload();
      return;
    }
    this.waiting = true;
    this.scene.time.delayedCall(
      this.selectedWeapon.delay,
      () => { this.waiting = false }
    );

    this.selectedWeapon.currentMag--;
  
    new Bullet(
      this.scene,
      x,
      y,
      this.selectedWeapon.ammoType,
      angleRad,
    );

    this.scene.sound.play(this.selectedWeapon.shotSound, {volume: 0.2});
    this.scene.cameras.main.shake(100, this.selectedWeapon.shakeIntensity);
    this.scene.ammoText.setText(this.selectedWeapon.currentMag.toString());
    
    if (this.selectedWeapon.currentMag === 0) this.reload();
  }

  reload() {
    if (this.selectedWeapon.mags <= 0) return;

    this.reloading = true;
    this.reloadingTimer = this.scene.time.delayedCall(
      this.selectedWeapon.reloadTime,
      this.doneReloading,
      null,
      this,
    );

    this.scene.ammoText.setText('Reloading');
  }

  private doneReloading() {
    this.selectedWeapon.currentMag = this.selectedWeapon.magCapacity;
    this.selectedWeapon.mags--;
    this.reloading = false;

    this.scene.ammoText.setText(this.selectedWeapon.currentMag.toString());
  }
}