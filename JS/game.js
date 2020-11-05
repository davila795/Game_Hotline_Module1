const Game = {
    canvas: undefined,
    ctx: undefined,
    width: undefined,
    height: undefined,
    FPS: 60,
    framesCounter: 0,
    score: undefined,
    background: undefined,
    player: undefined,
    enemies: [],
    keys: {
        up: 'w',
        left: 'a',
        down: 's',
        right: 'd',
        space: ' '
    },
    audio: new Audio('audio/GiorgiaAngiuli-PinkTechno.mp3'),
    status: 'main',

    init() {
        this.canvas = document.getElementById('canvas')
        this.ctx = this.canvas.getContext('2d')
        this.setDimension()
        this.score = 0
        this.scoreImage = new Image()
        this.scoreImage.src = 'img/caras5'
        this.lifeImage = new Image()
        this.lifeImage.src = 'img/caras vida'

        this.start()

    },


    setDimension() {
        this.backgroundW = 1600
        this.backgroundH = 900
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.backgroundX = this.canvas.width / 2 - this.backgroundW / 2
        this.backgroundY = this.canvas.height / 2 - this.backgroundH / 2
    },

    start() {

        this.reset()
        this.interval = setInterval(() => {

            switch (this.status) {

            }

            this.audio.play()
            this.clear()
            this.updatePlayerScore(this.player)
            this.drawAll()
            this.generateEnemies()

            this.framesCounter > 5000 ? this.framesCounter = 0 : this.framesCounter++

            //  TO TEST KILLS
            this.testCollisions(this.player, this.enemies)
            //  TO TEST IF ENEMY KILLS US WITH BULLET OR IF OUR BULLETS COLLISION EACH OTHER
            this.enemies.forEach(enemy => {
                if (enemy.bullets) {

                    if (this.testDeath(this.player, enemy.bullets)) {
                        this.player.hp === 0 ? this.gameOver() : null   //  TEST IF PLAYER HP IS ZERO BULLET REACH US  
                        this.player.hp--
                    }
                    this.testCollisions(enemy, this.player.bullets) //  TEST BULLETS COLLISION

                }
            })

            //  TEST IF ENEMY CAPTURE US
            if (this.testDeath(this.player, this.enemies)) {
                this.player.hp === 0 ? this.gameOver() : null
                this.player.hp--
            }

        }, 1000 / this.FPS)


    },

    reset() {
        this.background = new Background(this.ctx, this.backgroundW, this.backgroundH, this.backgroundX, this.backgroundY, this.canvas.width, this.canvas.height)
        this.player = new Player(this.ctx, this.backgroundW, this.backgroundH, this.backgroundX, this.backgroundY, this.canvas.width, this.canvas.height, 40, 40, 5, this.keys, 3, this.score)
        this.enemies = []

    },

    drawAll() {

        this.background.draw()
        this.player.draw(this.framesCounter)


        this.enemies.forEach(enemy => {
            this.updateFramesCounter(enemy)
            this.updatePlayerPos(enemy)
            enemy.draw(this.framesCounter)
        })
        this.drawLife()


    },

    drawLife() {
        this.ctx.font = '24px Arial'
        this.ctx.fillText('Hp: X ' + this.player.hp, 200, 75)
        this.ctx.drawImage(this.lifeImage, 270, 36, 70, 70)
        this.ctx.font = '24px Arial'
        this.ctx.fillText('Kills: ' + this.score, 360, 75)
        this.ctx.drawImage(this.scoreImage, 430, 36, 70, 70)



    },



    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    },

    generateEnemies() {
        if (this.framesCounter % 70 === 0) {
            this.enemies.push(new EnemyBasic(this.ctx, this.backgroundW, this.backgroundH, this.backgroundX, this.backgroundY, 50, 50, (Math.random() * 2) + 1, this.player.posX, this.player.posY, 1))
        }
        if (this.framesCounter % 120 === 0) {
            this.enemies.push(new EnemyShooter(this.ctx, this.backgroundW, this.backgroundH, this.backgroundX, this.backgroundY, 50, 50, (Math.random() * 1) + 1, this.player.posX, this.player.posY, 2))
        }
    },

    updatePlayerPos(elm) {  //  UPDATE PLAYER POS FOR CHASING IA ON THE ENEMIES
        elm.playerPosX = this.player.posX
        elm.playerPosY = this.player.posY
    },

    updatePlayerScore(elm) {    //  SCORE UPDATE IN OTHER CLASSES FOR BONUS AND EXTRA LIFE
        elm.score = this.score

    },

    updateFramesCounter(elm) {
        elm.framesCounter = this.framesCounter
    },

    testDeath(obj, objectArr) {

        return objectArr.some(elm => {
            let distanceX = obj.posX - elm.posX
            let distanceY = obj.posY - elm.posY
            if (Math.sqrt(distanceX * distanceX + distanceY * distanceY) < 30) {
                objectArr.splice(objectArr.indexOf(elm), 1)
                obj.threeSixtyAttack()
                return true
            }
        })
    },

    testCollisions(obj, objectArr) {
        objectArr.forEach(elm => {
            obj.bullets.forEach(bullet => {
                let distanceX = bullet.posX - elm.posX
                let distanceY = bullet.posY - elm.posY
                if (Math.sqrt(distanceX * distanceX + distanceY * distanceY) < 30) {

                    //  TEST IF ENEMY HP IS 0
                    elm.hp--
                    if (elm.hp === 0) {
                        let elementToRemove = objectArr.indexOf(elm)
                        objectArr.splice(elementToRemove, 1)
                        this.score++
                    }
                    let bulletToRemove = obj.bullets.indexOf(bullet)
                    obj.bullets.splice(bulletToRemove, 1)

                }

            })
        })
    },

    gameOver() {
        clearInterval(this.interval);
        this.audio.pause()
    }
}