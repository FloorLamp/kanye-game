import { playSound } from './sounds'
import { drawRect } from './Draw'
import { KEYS, DIRECTIONS } from './constants'

import Melee from './weapons/Melee'

export default class Player {

  constructor(game) {
    this.game = game

    this.size = {
      x: 40,
      y: 80
    }

    this.center = {
      x: 100,
      y: this.game.gameSize.y / 2
    }
    this.direction = DIRECTIONS.RIGHT

    this.speed = 5

    this.isAlive = true
    this.maxHealth = 50
    this.health = this.maxHealth

    this.melee = null

    var keyState = {}

    window.addEventListener('keydown', (e) => {
      keyState[e.keyCode] = true
    })

    window.addEventListener('keyup', (e) => {
      keyState[e.keyCode] = false
    })

    this.isDown = function(keyCode) {
      return keyState[keyCode] === true
    }
    this.isMoving = function() {
      return this.isDown(KEYS.LEFT) ||
             this.isDown(KEYS.RIGHT) ||
             this.isDown(KEYS.UP) ||
             this.isDown(KEYS.DOWN);
    }
  }

  takeDamage(damage) {
    this.health -= damage

    if (this.health <= 0) {
      this.isAlive = false
      this.game.lose()
    }
  }

  startAttack() {
    this.melee = new Melee(this.game, this)
    playSound('kanyeAttack')
  }

  destroyChild(name) {
    this[name] = null
  }

  update() {
    if (!this.isAlive) return

    if (this.isDown(KEYS.LEFT)) {
      this.center.x -= this.speed
      this.direction = DIRECTIONS.LEFT
    }
    if (this.isDown(KEYS.RIGHT)) {
      this.center.x += this.speed
      this.direction = DIRECTIONS.RIGHT
    }
    if (this.isDown(KEYS.UP)) this.center.y -= this.speed
    if (this.isDown(KEYS.DOWN)) this.center.y += this.speed

    if (this.isDown(KEYS.SPACE)) {
      if (this.melee === null) {
        this.startAttack()
      }
    }
    if (this.melee) {
      this.melee.update()
    }

    if (this.center.x < this.size.x / 2) this.center.x = this.size.x / 2
    else if (this.center.x > this.game.gameSize.x - this.size.x / 2) this.center.x = this.game.gameSize.x - this.size.x / 2
    if (this.center.y < this.size.y / 2) this.center.y = this.size.y / 2
    else if (this.center.y > this.game.gameSize.y - this.size.y / 2) this.center.y = this.game.gameSize.y - this.size.y / 2
  }

  draw() {
    drawRect(this.game.screen, this)

    if (this.melee && this.melee.isActive) {
      this.melee.draw(this.game.screen)
    }
  }
}
