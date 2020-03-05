import 'phaser';
import MainScene from './MainScene';
import WeaponsManager from './WeaponsManager';

export default class Player {
  public container;
  private character: Phaser.GameObjects.Sprite;
  private moveSpeed = 2;
  private weaponManager = new WeaponsManager(this.scene);
  
  constructor(private scene: MainScene, private x: number, private y: number, private sprite: string) {
    this.character = this.scene.add.sprite(0, 0, sprite);
    this.character.setOrigin(0.25, 0.5);

    
    // this.weapon = new Weapons.M4(this.scene, weaponOffset.x, weaponOffset.y);

    this.container = this.scene.add.container(x, y, [this.character, this.weaponManager.sprite]);
    this.container.setSize(20, 20);
    this.scene.matter.add.gameObject(this.container);
    this.container.setCircle(10);
  }

  handleInput() : void {
    const keys = this.scene.input.keyboard.addKeys('W, A, S, D, R, ONE, TWO');
    Object.keys(keys).map((key) => {
      keys[key] = keys[key].isDown;
    });
    
    const horizontalMove = -keys['A'] + keys['D'];
    const verticalMove = -keys['W'] + keys['S'];
    
    this.container.setVelocityX(horizontalMove * this.moveSpeed);
    this.container.setVelocityY(verticalMove * this.moveSpeed);

    if (keys['R']) {
      this.weaponManager.reload();
    }
    if (keys['ONE']) this.weaponManager.switchWeapon(0);
    if (keys['TWO']) this.weaponManager.switchWeapon(1);
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
    if (!this.weaponManager.canShoot) return;
    const bulletOffset = new Phaser.Geom.Point(this.weaponManager.bulletX, this.weaponManager.bulletY);
    Phaser.Math.Rotate(bulletOffset, this.container.rotation);
    
    // Fire spread
    let spread = Phaser.Math.RND.normal() * this.weaponManager.spread;
    if (this.container.body.speed > 0) spread *= this.weaponManager.MOVING_SPREAD_MODIFIER;
    
    this.container.angle += spread;

    const bulletX = this.container.x + bulletOffset.x;
    const bulletY = this.container.y + bulletOffset.y;
    this.weaponManager.shoot(bulletX, bulletY, this.container.rotation);

    const recoil = new Phaser.Math.Vector2(bulletOffset)
      .normalize()
      .scale(-1 * this.weaponManager.recoil);
    this.container.applyForce(recoil);
  }

  update(deltaTime) {
    this.handleInput();
    this.rotateToMouse();
    this.container.setAngularVelocity(0);

    // Shooting
    if (this.scene.input.mousePointer.leftButtonDown()) {
        this.shoot();
    }
  }
}