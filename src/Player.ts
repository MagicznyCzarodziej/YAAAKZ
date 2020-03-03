import 'phaser';
import MainScene from './MainScene';
import * as Weapons from './Weapon';
import Bullet from './Bullet';

export default class Player {
  public container;
  private character: Phaser.GameObjects.Sprite;
  private weapon : Weapons.Weapon;
  private weaponCooldown = 0;
  private moveSpeed = 2;
  
  constructor(private scene: MainScene, private x: number, private y: number, private sprite: string) {
    this.character = this.scene.add.sprite(0, 0, sprite);
    this.character.setOrigin(0.25, 0.5);

    const weaponOffset = { x: 3, y: 2};
    this.weapon = new Weapons.M4(this.scene, weaponOffset.x, weaponOffset.y);

    this.container = this.scene.add.container(x, y, [this.character, this.weapon])
    this.container.setSize(20, 20);
    this.scene.matter.add.gameObject(this.container);
  }

  handleInput() : void {
    const keys = this.scene.input.keyboard.addKeys('W, A, S, D');
    Object.keys(keys).map((key) => {
      keys[key] = keys[key].isDown;
    });
    
    const horizontalMove = -keys['A'] + keys['D'];
    const verticalMove = -keys['W'] + keys['S'];
    
    this.container.setVelocityX(horizontalMove * this.moveSpeed);
    this.container.setVelocityY(verticalMove * this.moveSpeed);
  }

  rotateToMouse() : void {
    // Difference between player and weapon origins
    const offsetY = 8 // Verticel distance from player sprite origin (head) to weapon
    const rotationOrigin = new Phaser.Geom.Point(0, offsetY);
    Phaser.Math.Rotate(rotationOrigin, this.container.rotation);
    const mousePosition = this.scene.input.mousePointer.positionToCamera(this.scene.cameras.main);
    const rotationOffset = new Phaser.Math.Vector2(
      this.container.x+ rotationOrigin.x,
      this.container.y + rotationOrigin.y
    );
    const angleRad = Phaser.Math.Angle.BetweenPoints(rotationOffset, mousePosition);
    this.container.rotation = Phaser.Math.Angle.RotateTo(this.container.rotation, angleRad, 0.1);
  }

  shoot() {
    const bulletOffset = new Phaser.Geom.Point(this.weapon.offsetX, this.weapon.offsetY);
    Phaser.Math.Rotate(bulletOffset, this.container.rotation);
    
    // Compensation for drifting around when player is moving
    // const driftCompensation = this.container.velocity.clone().normalize().scale(2);

    // Fire spread
    let spread = Phaser.Math.RND.normal() * this.weapon.spread;
    if (this.container.speed > 0) spread *= Weapons.MOVING_SPREAD_MODIFIER;
    this.container.angle += spread;

    new Bullet(
      this.scene,
      this.container.x + bulletOffset.x,// + driftCompensation.x,
      this.container.y + bulletOffset.y,// + driftCompensation.y,
      this.weapon.ammoType,
      this.container.rotation,
    );

    const recoil = new Phaser.Math.Vector2(bulletOffset).normalize().scale(-1);
    this.container.setVelocity(recoil.x, recoil.y);
 
    this.scene.sound.play(this.weapon.shotSound, {volume: 0.2});
  }

  update(deltaTime) {
    this.handleInput();
    this.rotateToMouse();

    // Shooting
    if (this.scene.input.mousePointer.leftButtonDown()) {
      if (this.weaponCooldown <= 0) {
        this.shoot();
        this.scene.cameras.main.shake(100, 0.0006);
        this.weaponCooldown = this.weapon.delay;
      } else this.weaponCooldown -= deltaTime;
    }
  }
}