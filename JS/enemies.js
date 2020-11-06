class Enemy {
    constructor(ctx, backgroundW, backgroundH, backgroundX, backgroundY, enemyWidth, enemyHeight, enemySpeed, playerX, playerY, hp) {
        this.ctx = ctx
        this.backgroundWidth = backgroundW
        this.backgroundHeight = backgroundH
        this.backgroundPosX = backgroundX
        this.backgroundPosY = backgroundY
        this.width = enemyWidth
        this.height = enemyHeight
        this.playerPosX = playerX
        this.playerPosY = playerY
        this.posX = undefined
        this.posY = undefined
        this.hp = hp
        this.speed = enemySpeed
        this.init()
    }

    init() {
        this.posX = parseInt(Math.random() * (this.backgroundWidth - this.backgroundPosX) + this.backgroundPosX)
        this.posY = parseInt(Math.random() * (this.backgroundHeight - this.backgroundPosY) + this.backgroundPosY)

        //  PARA QUE NO NAZCAN ENCIMA O CASI ENCIMA
        if (Math.abs(this.posX - this.playerPosX) < 80) { this.posX += 120 }
        if (Math.abs(this.posY - this.playerPosY) < 80) { this.posY += 120 }


    }

    draw() {

        this.ctx.fillStyle = 'blue'
        this.ctx.fillRect(this.posX, this.posY, this.width, this.height)

        this.move()

    }


    move() {

        let diffX = this.playerPosX - this.posX
        let diffY = this.playerPosY - this.posY

        diffX > 0 ? this.posX += this.speed : this.posX -= this.speed
        diffY > 0 ? this.posY += this.speed : this.posY -= this.speed

    }

}

class EnemyBasic extends Enemy {

    constructor(ctx, backgroundW, backgroundH, backgroundX, backgroundY, enemyWidth, enemyHeight, enemySpeed, playerX, playerY, hp) {
        super(ctx, backgroundW, backgroundH, backgroundX, backgroundY, enemyWidth, enemyHeight, enemySpeed, playerX, playerY, hp)
        //IMAGEN
        this.image = new Image()
        this.imgSrcArray = ['img/enemies/basicEnemy1.png', 'img/enemies/basicEnemy2.png']
        let srcSelector = Math.floor(Math.random() * 2)
        this.image.src = this.imgSrcArray[srcSelector]

        this.image.frames = srcSelector == 0 ? 10 : 8
        this.image.framesIndex = 0


    }




    //  IMAGEN Y ANIMACION
    draw(framesCounter) {

        this.ctx.drawImage(
            this.image,
            this.image.framesIndex * Math.floor(this.image.width / this.image.frames), 0,
            Math.floor(this.image.width / this.image.frames),
            this.image.height,
            this.posX,
            this.posY,
            this.width,
            this.height,
        )

        this.animate(framesCounter)


        this.move()
    }

    animate(framesCounter) {
        if (framesCounter % 5 === 0) {
            this.image.framesIndex++;
        }
        if (this.image.framesIndex > this.image.frames - 1) {
            this.image.framesIndex = 0;
        }
    }

}


class EnemyShooter extends Enemy {

    constructor(ctx, backgroundW, backgroundH, backgroundX, backgroundY, enemyWidth, enemyHeight, enemySpeed, playerX, playerY, hp) {
        super(ctx, backgroundW, backgroundH, backgroundX, backgroundY, enemyWidth, enemyHeight, enemySpeed, playerX, playerY, hp)
        // this.framesCounter = framesCounter
        this.bullets = []
        this.aimAngle = undefined
        this.image = new Image()
        this.imgSrcArray = ['img/enemies/shooterEnemy1.png', 'img/enemies/shooterEnemy2.png']
        let srcSelector = Math.floor(Math.random() * 2)
        this.image.src = this.imgSrcArray[srcSelector]



    }

    draw(framesCounter) {

        this.ctx.save()
        this.ctx.translate(
            this.posX,
            this.posY
        )
        this.ctx.rotate(this.aimAngle * Math.PI / 180)
        this.ctx.drawImage(
            this.image,
            -this.width / 2,
            -this.height / 2,
        )
        this.ctx.restore()
        this.move()
        this.shoot()

        this.bullets.forEach(bullet => {
            bullet.draw()
        })
        this.clearBullets()
    }


    shoot() {

        this.aim()
        if (this.framesCounter % 100 === 0) {
            this.bullets.push(new Bullets(this.ctx, this.posX, this.posY, this.aimAngle, this.width, this.height, 8, 'img/items/enemyBullet1.png'))
        }

    }

    aim() {
        let aimX = this.playerPosX -= this.posX
        let aimY = this.playerPosY -= this.posY
        this.aimAngle = Math.atan2(aimY, aimX) / Math.PI * 180
    }

    clearBullets() {

        this.bullets = this.bullets.filter(bullet => bullet.posX <= this.backgroundPosX + this.backgroundWidth && bullet.posX >= this.backgroundPosX && bullet.posY >= this.backgroundPosY && bullet.posY <= this.backgroundPosY + this.backgroundHeight)

    }


}