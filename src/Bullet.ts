import 'phaser';

export default class Bullet extends Phaser.GameObjects.Image {
  body: Phaser.Physics.Arcade.Body;
  speed = 1100;

  constructor(scene: Phaser.Scene, x: number, y: number, sprite: string, angle) {
    super(scene, x, y, sprite);
    scene.add.existing(this);
    scene.physics.add.existing(this, false);
    scene.physics.world.enableBody(this, 0);

    this.setOrigin(0, 0);
    this.setAngle(angle);
    const velocity = new Phaser.Math.Vector2();
    this.scene.physics.velocityFromAngle(angle, this.speed, velocity);
    this.body.setVelocity(velocity.x, velocity.y);
  }
}
