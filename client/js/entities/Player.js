import { playSound } from '../sounds'
import { drawRect, drawSprite } from '../Draw'
import { KEYS, DIRECTIONS } from '../constants'

import Entity from '../Entity'
import Melee from '../weapons/Melee'

export default class Player extends Entity {

  constructor(game) {
    super(game)

    this.id = 'player'

    this.sprites = {
      normal: require('../../img/kanyesprite.png'),
      reverse: require('../../img/kanyespritereverse.png'),
    }
    this.spriteScale = 3

    this.size = {
      x: 40,
      y: 80
    }

    this.center = {
      x: 100,
      y: this.game.gameSize.y - 70
    }
    this.direction = DIRECTIONS.RIGHT

    this.speed = 5

    this.maxHealth = 50
    this.health = this.maxHealth
    this.invincibilityFrame = 0
    this.attackCooldownFrame = 0

    this.melee = null
    this.item = null

    var keyState = {}

    window.addEventListener('keydown', (e) => {
      keyState[e.keyCode] = true
    })

    window.addEventListener('keyup', (e) => {
      keyState[e.keyCode] = false
    })

    window.addEventListener('mouseup', (e) => {
      this.clicked = true
    })

    this.isDown = function(keyCode) {
      return keyState[keyCode] === true
    }
  }

  get isMoving() {
    return this.isDown(KEYS.LEFT) ||
           this.isDown(KEYS.RIGHT) ||
           this.isDown(KEYS.UP) ||
           this.isDown(KEYS.DOWN)
  }

  get isAlive() {
    return this.health > 0
  }

  get isInvincible() {
    return this.invincibilityFrame > 0
  }

  takeDamage(damage) {
    if (this.isInvincible) return

    this.health -= damage

    if (!this.isAlive) {
      this.game.lose()
    }

    // start invincibility
    this.invincibilityFrame++
  }

  heal(amount) {
    this.health += amount
    if (this.health > this.maxHealth)
      this.health = this.maxHealth
  }

  startAttack() {
    this.melee = new Melee(this.game, this)
    playSound('kanyeFistAttack')
  }

  stopAttack() {
    this.attackCooldownFrame++
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

    if (this.melee && this.game.bodies.objects[this.melee.id] === undefined) this.melee = null;

    if (this.isDown(KEYS.SPACE)) {
      if (this.melee === null) {
        this.startAttack()
      }
    }
    if (this.clicked) {
      this.clicked = false
      if (this.item) this.item.use()
    }

    this.move()

    if (this.isInvincible) {
      this.invincibilityFrame++

      if (this.invincibilityFrame > 30) this.invincibilityFrame = 0
    }
  }

  draw() {
    if (this.isInvincible && this.invincibilityFrame % 6 === 0) {}
    else {
      if (this.direction === DIRECTIONS.RIGHT) drawSprite(this.game.screen, this.center, this.sprites.normal, this.spriteScale)
      else drawSprite(this.game.screen, this.center, this.sprites.reverse, this.spriteScale)
    }
  }

  destroy() {}

}
