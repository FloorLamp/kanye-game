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
    this.invincibilityFrame = 0

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

  isInvincible() {
    return this.invincibilityFrame > 0
  }

  takeDamage(damage) {
    if (this.isInvincible()) return

    this.health -= damage

    if (this.health <= 0) {
      this.isAlive = false
      this.game.lose()
    }

    this.invincibilityFrame++
  }

  startAttack() {
    this.melee = new Melee(this.game, this)
    playSound('kanyeFistAttack')
  }

  destroyChild(name) {
    this[name] = null
  }

  move() {
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

    if (this.center.x < this.size.x / 2) this.center.x = this.size.x / 2
    else if (this.center.x > this.game.gameSize.x - this.size.x / 2) this.center.x = this.game.gameSize.x - this.size.x / 2
    if (this.center.y < this.size.y / 2) this.center.y = this.size.y / 2
    else if (this.center.y > this.game.gameSize.y - this.size.y / 2) this.center.y = this.game.gameSize.y - this.size.y / 2
  }

  update() {
    if (!this.isAlive) return

    if (this.isDown(KEYS.SPACE)) {
      if (this.melee === null) {
        this.startAttack()
      }
    }
    if (this.melee) {
      this.melee.update()
    }
    this.move()

    if (this.isInvincible()) {
      this.invincibilityFrame++

      if (this.invincibilityFrame > 30) this.invincibilityFrame = 0
    }
  }

  draw() {
    if (this.isInvincible() && this.invincibilityFrame % 6 === 0) {}
    else drawRect(this.game.screen, this)

    if (this.melee && this.melee.isActive) {
      this.melee.draw(this.game.screen)
    }
  }
}
