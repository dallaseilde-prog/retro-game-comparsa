export class Tilemap {
  constructor(tileSize) {
    this.tileSize = tileSize;
    this.map = [];
    this.width = 0;
    this.height = 0;
  }
  load(levelMatrix) {
    this.map = levelMatrix;
    this.height = levelMatrix.length;
    this.width = levelMatrix[0].length;
    let coffee = 0;
    for (let y = 0; y < this.height; y++)
      for (let x = 0; x < this.width; x++)
        if (this.map[y][x] === 2) coffee++;
    return coffee;
  }
  draw(ctx) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.map[y][x];
        const px = x * this.tileSize;
        const py = y * this.tileSize;
        if (tile === 1) {
          ctx.fillStyle = '#330066'; 
          ctx.fillRect(px, py, this.tileSize, this.tileSize);
          ctx.fillStyle = '#ff007f'; 
          ctx.fillRect(px, py, this.tileSize, 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.fillRect(px + 4, py + 4, this.tileSize - 8, this.tileSize - 8);
        } else if (tile === 2) {
          ctx.fillStyle = '#ffd700';
          ctx.beginPath();
          ctx.arc(px + this.tileSize/2, py + this.tileSize/2, 5, 0, Math.PI*2);
          ctx.fill();
        } else if (tile === 3) {
          ctx.fillStyle = '#00f2ff';
          ctx.fillRect(px + 2, py + 2, this.tileSize - 4, this.tileSize - 4);
          ctx.strokeStyle = '#fff';
          ctx.strokeRect(px + 4, py + 4, this.tileSize - 8, this.tileSize - 8);
        } else if (tile === 4) {
          ctx.fillStyle = '#ff4d4d';
          ctx.beginPath();
          ctx.moveTo(px, py + this.tileSize);
          ctx.lineTo(px + this.tileSize/2, py + 4);
          ctx.lineTo(px + this.tileSize, py + this.tileSize);
          ctx.fill();
        }
      }
    }
  }
  getTile(col, row) {
    if (col < 0 || col >= this.width || row < 0 || row >= this.height) return 1;
    return this.map[row][col];
  }
  removeCoffee(col, row) {
    if (this.map[row][col] === 2) {
      this.map[row][col] = 0;
      return true;
    }
    return false;
  }
}
