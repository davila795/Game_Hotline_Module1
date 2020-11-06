class Bullets {

    constructor(ctx, playerPosX, playerPosY, bulletAngle, playerWidth, playerHeight, bulletSpeed, img) {

        this.ctx = ctx
        this.height = playerHeight
        this.width = playerWidth
        this.posX = playerPosX
        this.posY = playerPosY
        this.bulletAngle = bulletAngle

        //IMAGEN
        this.image = new Image()
        this.image.src = img

        this.audio = new Audio('audio/effects/gunshot.mp3')

        this.velX = Math.cos(this.bulletAngle / 180 * Math.PI) * bulletSpeed
        this.velY = Math.sin(this.bulletAngle / 180 * Math.PI) * bulletSpeed
    }


    draw() {

        this.ctx.save()
        this.ctx.translate(
            this.posX,
            this.posY
        )
        this.ctx.rotate(this.bulletAngle * Math.PI / 180)
        this.ctx.drawImage(
            this.image,
            -this.width / 2,
            -this.height / 2,
        )
        this.ctx.restore()
        this.audio.play()
        this.audio.volume = 0.5

        this.move()
    }


    move() {

        this.posX += this.velX
        this.posY += this.velY

    }
}