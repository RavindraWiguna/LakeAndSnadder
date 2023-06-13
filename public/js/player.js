export class Player{

    constructor(id, name, spritePath, pos){
        this.id =id;
        this.name=name;
        this.spritePath=spritePath;
        this.pos=pos;
    }

    render(canvas, context){
        let unitLength = canvas.width/10;

        let pieceSize = unitLength*0.6;

        // calc letak di canvas
        let x = (this.pos-1)%10;
        let y = Math.floor((100-this.pos)/10);

        x=x*unitLength + pieceSize/4;
        y=y*unitLength + pieceSize/4;

        // console.log(x, y);
        let sprite = new Image();
        // console.log(this.spritePath);

        sprite.src = this.spritePath;
        sprite.onload = function(){
            // console.log("masuk");
            // console.log(typeof sprite, "nani", sprite.src);
            context.drawImage(sprite, x, y, pieceSize, pieceSize);
        }
        // console.log("panggil");
    }
    

}