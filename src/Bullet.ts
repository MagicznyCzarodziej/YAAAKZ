import 'phaser';

export default class Bullet extends Phaser.Physics.Matter.Image {
  speed = 40;

  constructor(scene: Phaser.Scene, x: number, y: number, sprite: string, angleRad) {
    super(scene.matter.world, x, y, sprite);
    this.setOrigin(0);
    this.setFrictionAir(0);
    this.setCollidesWith(0)
    scene.add.existing(this);

    this.setRotation(angleRad);
    const velocityX = this.speed * Math.cos(angleRad);
    const velocityY = this.speed * Math.sin(angleRad);
    this.setVelocity(velocityX, velocityY);
  }
}
