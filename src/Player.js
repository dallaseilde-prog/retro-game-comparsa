export class Player {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.width = 16;
    this.height = 16;
    this.vx = 0;
    this.vy = 0;
    this.speed = 100;
    this.jumpForce = 250;
    this.gravity = 550;
    this.grounded = false;
    this.color = '#00f2ff';
  }
  reset(x, y) {
    this.x = x * this.game.tilemap.tileSize;
    this.y = y * this.game.tilemap.tileSize;
    this.vx = 0;
    this.vy = 0;
    this.grounded = false;
  }
  update(dt) {
    const input = this.game.input;
    if (input.isDown('ArrowLeft') || input.isDown('KeyA')) this.vx = -this.speed;
    else if (input.isDown('ArrowRight') || input.isDown('KeyD')) this.vx = this.speed;
    else this.vx = 0;
    if ((input.isDown('Space') || input.isDown('ArrowUp') || input.isDown('KeyW')) && this.grounded) {
      this.vy = -this.jumpForce;
      this.grounded = false;
      this.game.audio.playJump();
    }
    this.vy += this.gravity * dt;
    this.x += this.vx * dt;
    this.checkHorizontalCollisions();
    this.y += this.vy * dt;
    this.checkVerticalCollisions();
    this.checkInteractions();
    if (this.y > this.game.height) this.game.die();
  }
  checkHorizontalCollisions() {
    const ts = this.game.tilemap.tileSize;
    const tm = this.game.tilemap;
    const left = Math.floor(this.x / ts);
    const right = Math.floor((this.x + this.width - 0.1) / ts);
    const top = Math.floor(this.y / ts);
    const bottom = Math.floor((this.y + this.height - 0.1) / ts);
    if (this.vx > 0 && (tm.getTile(right, top) === 1 || tm.getTile(right, bottom) === 1)) {
        this.x = right * ts - this.width;
        this.vx = 0;
    } else if (this.vx < 0 && (tm.getTile(left, top) === 1 || tm.getTile(left, bottom) === 1)) {
        this.x = (left + 1) * ts;
        this.vx = 0;
    }
  }
  checkVerticalCollisions() {
    const ts = this.game.tilemap.tileSize;
    const tm = this.game.tilemap;
    const left = Math.floor(this.x / ts);
    const right = Math.floor((this.x + this.width - 0.1) / ts);
    const top = Math.floor(this.y / ts);
    const bottom = Math.floor((this.y + this.height - 0.1) / ts);
    this.grounded = false;
    if (this.vy > 0 && (tm.getTile(left, bottom) === 1 || tm.getTile(right, bottom) === 1)) {
        this.y = bottom * ts - this.height;
        this.vy = 0;
        this.grounded = true;
    } else if (this.vy < 0 && (tm.getTile(left, top) === 1 || tm.getTile(right, top) === 1)) {
        this.y = (top + 1) * ts;
        this.vy = 0;
    }
  }
  checkInteractions() {
    const ts = this.game.tilemap.tileSize;
    const tm = this.game.tilemap;
    const col = Math.floor((this.x + this.width/2)/ts);
    const row = Math.floor((this.y + this.height/2)/ts);
    const tile = tm.getTile(col, row);
    if (tile === 2 && tm.removeCoffee(col, row)) this.game.collectCoffee();
    else if (tile === 3) this.game.winLevel();
    else if (tile === 4) this.game.die();
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);
    ctx.fillStyle = 'white';
    if (this.vx >= 0) ctx.fillRect(Math.floor(this.x + 10), Math.floor(this.y + 4), 4, 4);
    else ctx.fillRect(Math.floor(this.x + 2), Math.floor(this.y + 4), 4, 4);
  }
}
