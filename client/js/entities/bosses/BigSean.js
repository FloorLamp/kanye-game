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

    this.maxSpeed = 12
    this.accelerationFrames = 60
    this.maxHealth = 30
    this.health = this.maxHealth
    this.takesKnockback = false
    this.damage = 10
    this.destination = null

    this.lootTable = _.pairs({
      SunglassesAdvil: .7,
      Diamonds: .7,
    })
  }

  startAttack() {
    let dy = Math.random() * this.game.gameSize.y
    this.destination = {
      x: this.size.x / 2,
      y: this.center.y + (Math.random() - 1) * dy,
    }
    if (this.center.x < this.game.gameSize.x / 2) this.destination.x = this.game.gameSize.x - this.size.x / 2

    if (this.destination.y < this.size.y / 2) {
      this.destination.y += dy
    } else if (this.destination.y > this.game.gameSize.y - this.size.y / 2) {
      this.destination.y -= dy
    }

    this.attackFrame = 1

    if (this.destination.x === this.size.x / 2)
      playSound('bigseanAttack')
  }

  move() {
    if (this.center.x <= this.size.x / 2 || this.center.x >= this.game.gameSize.x - this.size.x / 2) {
      if (!this.destination || Math.abs(this.destination.x - this.center.x) <= this.maxSpeed)
        this.startAttack()
    }

    if (this.isAttacking)
      this.attackFrame++

    this.speed = this.attackFrame < 60 ? (this.attackFrame / this.accelerationFrames * this.maxSpeed) : this.maxSpeed
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
