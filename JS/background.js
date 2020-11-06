
class Background {

    constructor(ctx, backgroundW, backgroundH, backgroundX, bakckgroundY, gameW, gameH) {
        this.ctx = ctx
        this.gameWidth = gameW
        this.gameHeight = gameH
        this.width = backgroundW
        this.height = backgroundH
        this.posX = backgroundX
        this.posY = bakckgroundY

        //IMAGEN
        this.image = new Image()
        this.image.src = 'img/backgrounds/background.png'
    }


    draw() {

        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight)

        this.ctx.drawImage(
            this.image,
            this.posX,
            this.posY,
            this.width,
            this.height,
        )
    }
}