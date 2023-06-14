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
    this.finalpos = pos;
    this.oldpos = pos;
  }

  getRowCol() {
    // calc letak di canvas
    let zeroIndexPos = this.pos - 1;

    let x = zeroIndexPos % 10;
    let y = Math.floor((99 - zeroIndexPos) / 10);

    if (y % 2 == 0) {
      x = 9 - x;
    }
    return [x, y];
  }

  render(canvas, context) {
    let unitLength = canvas.width / 10;

    let pieceSize = unitLength * 0.6;

    // calc letak di canvas
    let result = this.getRowCol();
    let x = result[0];
    let y = result[1];
    x = Math.floor(x * unitLength + pieceSize / 4);
    y = Math.floor(y * unitLength + pieceSize / 4);
    // console.log(x,y,this.name);
    context.drawImage(this.sprite, x, y, pieceSize, pieceSize);
  }
}

// export default Player;
// module.exports = Player;
