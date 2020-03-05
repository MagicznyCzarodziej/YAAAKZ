import 'phaser';

export default class Bullet extends Phaser.Physics.Matter.Image {
  private speed = 30;
  private lifetime = 3000;

  constructor(scene: Phaser.Scene, x: number, y: number, sprite: string, angleRad: number) {
    super(scene.matter.world, x, y, sprite);
    this.setFrictionAir(0);
    // this.setCollidesWith(0)
    scene.add.existing(this);

    this.setRotation(angleRad);
    const velocityX = this.speed * Math.cos(angleRad);
    const velocityY = this.speed * Math.sin(angleRad);
    this.setVelocity(velocityX, velocityY);

    this.setOnCollide(() => {
      this.destroy();
    });

    // Destroy bullet after it's lifetime
    this.scene.time.delayedCall(
      this.lifetime,
      () => { this.destroy() },
      null,
      this
    );
  }
}
