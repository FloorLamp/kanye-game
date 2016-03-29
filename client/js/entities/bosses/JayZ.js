import { playSound } from '../../sounds'
import { getDistance, getScaledVector } from '../../utils'

import Enemy from '../Enemy'
import Ball from '../../weapons/projectiles/Ball'

export default class JayZ extends Enemy {

  constructor(game, opts) {
    super(game, opts)

    // this.sprites = {
    //   normal: require('../../../img/twochainz.png'),
    //   reverse: require('../../../img/twochainzreverse.png'),
    // }
    // this.spriteScale = 4

    this.speed = 3
    this.maxHealth = 50
    this.health = this.maxHealth
    this.takesKnockback = false

    this.vector = getScaledVector(this.center, {x: Math.random() - 1, y: Math.random() - 1}, this.speed)

    this.lootTable = _.pairs({
      SunglassesAdvil: .7,
      Diamonds: .7,
    })
  }

  move() {
    this.center.x += this.vector.x
    this.center.y += this.vector.y

    // bounce off walls
    if (this.center.x < this.size.x / 2) {
      this.center.x = this.size.x / 2
      this.vector.x *= -1
    } else if (this.center.x > this.game.gameSize.x - this.size.x / 2) {
      this.center.x = this.game.gameSize.x - this.size.x / 2
      this.vector.x *= -1
    }

    if (this.center.y < this.size.y / 2) {
      this.center.y = this.size.y / 2
      this.vector.y *= -1
    } else if (this.center.y > this.game.gameSize.y - this.size.y / 2) {
      this.center.y = this.game.gameSize.y - this.size.y / 2
      this.vector.y *= -1
    }

  }

  attack() {
    if (!this.isAttacking) {
      new Ball(this.game, this)
      playSound('jayzAttack')
    }

    if (this.attackFrame == 10 || this.attackFrame == 20) {
      new Ball(this.game, this)
    }

    this.attackFrame++

    if (this.attackFrame === 150) {
      this.attackFrame = 0
    }
  }

}
