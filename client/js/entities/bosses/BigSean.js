import { isColliding } from '../../utils'
import { playSound } from '../../sounds'
import { getDistance, getScaledVector } from '../../utils'

import Enemy from '../Enemy'

export default class BigSean extends Enemy {

  constructor(game, opts) {
    super(game, opts)

    // this.sprites = {
    //   normal: require('../../../img/twochainz.png'),
    //   reverse: require('../../../img/twochainzreverse.png'),
    // }
    // this.spriteScale = 4

    this.size = {
      x: 80,
      y: 40
    }

    this.maxSpeed = 15
    this.accelerationFrames = 90
    this.maxHealth = 30
    this.health = this.maxHealth
    this.takesKnockback = false
    this.damage = 10
    this.destination = null

    this.lootTable = _.pairs({
      BlackBalls: 1,
    })
  }

  startAttack() {
    let dy = Math.random() * this.game.gameSize.y
    this.destination = {
      x: 0,
      y: this.center.y + (Math.random() - 1) * dy,
    }
    if (this.center.x <= 0) this.destination.x = this.game.gameSize.x

    if (this.destination.y < this.size.y / 2) {
      this.destination.y += dy
    } else if (this.destination.y > this.game.gameSize.y - this.size.y / 2) {
      this.destination.y -= dy
    }

    this.attackFrame = 1

    if (this.destination.x === 0)
      playSound('bigseanAttack')
  }

  move() {
    if (this.center.x <= 0 || this.center.x >= this.game.gameSize.x) {
      if (!this.destination || Math.abs(this.destination.x - this.center.x) <= this.maxSpeed)
        this.startAttack()
    }

    if (this.isAttacking)
      this.attackFrame++

    this.speed = this.attackFrame < this.accelerationFrames ? (this.attackFrame / this.accelerationFrames * this.maxSpeed) : this.maxSpeed
    this.vector = getScaledVector(this.center, this.destination, this.speed)

    this.center.x += this.vector.x
    this.center.y += this.vector.y

  }

  attack() {
    if (isColliding(this, this.game.player)) {
      // this.enemiesHit.add(enemyId)
      this.game.player.takeDamage(this.damage)
    }
  }

}
