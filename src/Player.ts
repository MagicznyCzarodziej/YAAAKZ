import 'phaser';
import * as Weapons from './Weapon';
import Bullet from './Bullet';

export default class Player extends Phaser.GameObjects.Container {
  body : Phaser.Physics.Arcade.Body;
  private weapon : Weapons.Weapon;
  private weaponCooldown = 0;
  private moveSpeed = 200;

  constructor(config) {
    super(config.scene, config.x, config.y, config.children);

    const character = this.scene.add.sprite(0, 0, 'player').setOrigin(0.25, 0.5);
    this.add(character);

    const weaponOffset = { x: 3, y: 2};
    this.weapon = new Weapons.M4(this.scene, weaponOffset.x, weaponOffset.y);
    this.add(this.weapon);

    config.scene.add.existing(this);
    config.scene.physics.add.existing(this, 0);
    config.scene.physics.world.enableBody(this, 0);
    this.body.setMaxSpeed(this.moveSpeed);
  }

  handleInput() : void {
    const keys = this.scene.input.keyboard.addKeys('W, A, S, D');
    Object.keys(keys).map((key) => {
      keys[key] = keys[key].isDown;
    });
    
    const horizontalMove = -keys['A'] + keys['D'];
    const verticalMove = -keys['W'] + keys['S'];

    this.body.setVelocityX(horizontalMove * this.moveSpeed);
    this.body.setVelocityY(verticalMove * this.moveSpeed);
  }

  rotateToMouse() : void {
    // Difference between player and weapon origins
    const offsetY = 8 // Verticel distance from player sprite origin (head) to weapon
    const rotationOrigin = new Phaser.Geom.Point(0, offsetY);
    Phaser.Math.Rotate(rotationOrigin, this.rotation);
    const mousePosition = this.scene.input.mousePointer.position;
    const rotationOffset = new Phaser.Math.Vector2(
      this.scene.cameras.main.centerX + rotationOrigin.x,
      this.scene.cameras.main.centerY + rotationOrigin.y
    );
    const angle = Phaser.Math.Angle.BetweenPoints(rotationOffset, mousePosition);
    this.rotation = Phaser.Math.Angle.RotateTo(this.rotation, angle, 0.1);
  }
  
  shoot() {
    const bulletOffset = new Phaser.Geom.Point(this.weapon.offsetX, this.weapon.offsetY);
    Phaser.Math.Rotate(bulletOffset, this.rotation);
    
    // Compensation for drifting around when player is moving
    const driftCompensation = this.body.velocity.clone().normalize().scale(2);

    // Fire spread
    let spread = Phaser.Math.RND.normal() * this.weapon.spread;
    if (this.body.speed > 0) spread *= Weapons.MOVING_SPREAD_MODIFIER;
    this.angle += spread;

    this.scene.bullets.add(new Bullet(
      this.scene,
      this.x + bulletOffset.x + driftCompensation.x,
      this.y + bulletOffset.y + driftCompensation.y,
      this.weapon.ammoType,
      this.angle,
    ));

    const recoil = new Phaser.Math.Vector2(bulletOffset).normalize().scale(-50);
    this.body.setVelocity(recoil.x, recoil.y);
 
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
};