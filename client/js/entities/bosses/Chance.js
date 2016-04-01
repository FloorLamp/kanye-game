import { playSound } from '../../sounds'
import { getRandomVector, getScaledVector } from '../../utils'

import Enemy from '../Enemy'
import UltralightBeam from '../../weapons/UltralightBeam'

export default class Chance extends Enemy {

  constructor(game, opts) {
    super(game, opts)

    // this.sprites = {
    //   normal: require('../../../img/twochainz.png'),
    //   reverse: require('../../../img/twochainzreverse.png'),
    // }
    // this.spriteScale = 4

    this.speed = 6
    this.maxHealth = 150
    this.health = this.maxHealth
    this.takesKnockback = false
    this.arc = 270 // deg
    this.attackFrames = 600
    this.attackFrame = -240

    this.vector = getRandomVector(this.speed)

    this.lootTable = _.pairs({
      UltralightBeam: 1,
    })
  }

  move() {
    if (this.isAttacking && this.attackFrame <= this.attackFrames) return

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
    if (this.attackFrame === 0) {
      playSound('ultralight_beam')
      this.startAttack()
      this.attackCount++
    }
    if (this.isAttacking && this.attackFrame <= this.attackFrames) {
      let theta = this.attackFrame / this.attackFrames * this.arc / 360 * 2 * Math.PI
      new UltralightBeam(this.game, this, {x: Math.cos(theta), y: Math.sin(theta)})
    }

    this.attackFrame++

    if (this.attackFrame === 720) {
      this.attackFrame = 0
    }
  }

}
