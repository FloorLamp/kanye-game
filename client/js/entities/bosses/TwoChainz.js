import { playSound } from '../../sounds'
import { getDistance, getScaledVector } from '../../utils'

import Enemy from '../Enemy'
import Projectile from '../../weapons/projectiles/Projectile'

export default class TwoChainz extends Enemy {

  constructor(game, opts) {
    super(game, opts)

    this.sprites = {
      normal: require('../../../img/twochainz.png'),
      reverse: require('../../../img/twochainzreverse.png'),
    }
    this.spriteScale = 4

    this.speed = 3
    this.attackChance = .02
    this.maxHealth = 25
    this.health = this.maxHealth

    this.vector = getScaledVector(this.center, {x: Math.random() - 1, y: Math.random() - 1}, this.speed)
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
    if (!this.isAttacking && Math.random() < this.attackChance) {
      new Projectile(this.game, this, this.game.player.center)
      playSound('twochainzAttack')
      this.attackFrame++
    }

    if (this.isAttacking) {
      if (this.attackFrame == 30) {
        new Projectile(this.game, this, this.game.player.center)
      }
      this.attackFrame++

      if (this.attackFrame === 100) {
        this.attackFrame = 0
      }
    }
  }

}
