export class Player {
  constructor(id, name, spritePath, pos) {
    this.id = id;
    this.name = name;
    this.spritePath = spritePath;
    // console.log(x, y);
    this.sprite = new Image();
    // console.log(this.spritePath);
    this.sprite.src = this.spritePath;
    this.pos = pos;
  }

  render(canvas, context) {
    let unitLength = canvas.width / 10;

    let pieceSize = unitLength * 0.6;

    // calc letak di canvas
    let x = (this.pos - 1) % 10;
    let y = Math.floor((100 - this.pos) / 10);

    x = x * unitLength + pieceSize / 4;
    y = y * unitLength + pieceSize / 4;

    context.drawImage(this.sprite, x, y, pieceSize, pieceSize);
  }
}
