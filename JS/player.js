class Player {
    constructor(ctx, backgroundWidth, backgroundHeight, backgroundX, backgroundY, gameW, gameH, playerWidth, playerHeight, playerSpeed, keys, hp, score) {
        this.ctx = ctx
        this.backgroundWidth = backgroundWidth
        this.backgroundHeight = backgroundHeight
        this.backgroundPosX = backgroundX
        this.backgroundPosY = backgroundY
        this.gameWidth = gameW
        this.gameHeigth = gameH
        this.width = playerWidth
        this.height = playerHeight
        this.speed = playerSpeed
        this.hp = hp
        this.score = score
        this.keys = keys

        //IMAGEN
        this.image = new Image()
        this.image.src = 'img/player/player.png'
        this.image.frames = 4
        this.image.framesIndex = 0

        this.init()

    }

    init() {
        this.posX = this.gameWidth / 2 - this.width / 2
        this.posY = this.gameHeigth / 2 - this.height / 2
        this.aimAngle = undefined
        this.recharge = 0
        this.bullets = []
        this.up = false
        this.down = false
        this.right = false
        this.left = false

        this.setListeners()
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
        this.bullets.forEach(bullet => bullet.draw())
        this.clearBullets()
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


    move() {

        this.left ? this.posX -= this.speed : null
        this.right ? this.posX += this.speed : null
        this.down ? this.posY += this.speed : null
        this.up ? this.posY -= this.speed : null

        this.posX < this.backgroundPosX + this.width / 2 ? this.posX = this.backgroundPosX + this.width / 2 : null
        this.posX > this.backgroundPosX + this.backgroundWidth - this.width / 2 ? this.posX = this.backgroundPosX + this.backgroundWidth - this.width / 2 : null
        this.posY < this.backgroundPosY + this.height / 2 ? this.posY = this.backgroundPosY + this.height / 2 : null
        this.posY > this.backgroundPosY + this.backgroundHeight - this.height / 2 ? this.posY = this.backgroundPosY + this.backgroundHeight - this.height / 2 : null



    }

    setListeners() {

        document.addEventListener("mousemove", evt => {
            let mouseX = evt.clientX - document.getElementById('canvas').getBoundingClientRect().left - 10
            let mouseY = evt.clientY - document.getElementById('canvas').getBoundingClientRect().top - 10
            mouseX -= this.posX
            mouseY -= this.posY
            this.aimAngle = Math.atan2(mouseY, mouseX) / Math.PI * 180

        })

        document.onkeydown = evt => {
            evt.key === this.keys.left ? this.left = true : null
            evt.key === this.keys.up ? this.up = true : null
            evt.key === this.keys.down ? this.down = true : null
            evt.key === this.keys.right ? this.right = true : null
            if (evt.key === this.keys.space) {
                if (this.score - this.recharge >= 25) { this.threeSixtyAttack(); this.recharge += 25 }  //  CHECKING EACH 25 KILLS FOR 360 ATTACK AVAILABILITY 
            }

        }

        document.onkeyup = evt => {
            evt.key === this.keys.left ? this.left = false : null
            evt.key === this.keys.up ? this.up = false : null
            evt.key === this.keys.down ? this.down = false : null
            evt.key === this.keys.right ? this.right = false : null
        }

        document.onclick = evt => {
            this.shoot()
        }
    }


    shoot() {
        let bala = new Bullets(this.ctx, this.posX, this.posY, this.aimAngle, this.width, this.height, 10, 'img/items/bullet1.png')

        this.bullets.push(bala)

    }

    threeSixtyAttack() {
        let threeSixtyAngle = 0
        while (threeSixtyAngle < 360) {
            this.bullets.push(new Bullets(this.ctx, this.posX, this.posY, threeSixtyAngle, this.width, this.height, 10, 'img/items/bullet1.png'))
            threeSixtyAngle += 7
        }
    }

    clearBullets() {

        this.bullets = this.bullets.filter(bullet => bullet.posX <= this.backgroundPosX + this.backgroundWidth && bullet.posX >= this.backgroundPosX && bullet.posY >= this.backgroundPosY && bullet.posY <= this.backgroundPosY + this.backgroundHeight)
    }


}