import 'phaser';

export default class Player extends Phaser.GameObjects.Sprite {
  private moveSpeed = 200;
  body : Phaser.Physics.Arcade.Body;

  constructor(config) {
    super(config.scene, config.x, config.y, config.sprite);
    config.scene.add.existing(this);
    config.scene.physics.add.existing(this, 0);
    config.scene.physics.world.enableBody(this, 0);
    this.body.setSize(28, 28, true);
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
    const mousePosition = this.scene.input.mousePointer.position;
    const angle = Phaser.Math.Angle.BetweenPoints(this, mousePosition);
    this.rotation = Phaser.Math.Angle.RotateTo(this.rotation, angle, 0.1);
  }
  
  update() {
    this.handleInput();
    this.rotateToMouse();
  }
};