import { playSound } from '../../sounds'
import { getScaledVector, getRandomVector, getBoundsPoint, getDestinationOfVector } from '../../utils'
import { STATUS } from '../../constants'

import Enemy from '../Enemy'
import Wave from '../../weapons/projectiles/Wave'

export default class ChrisBrown extends Enemy {

  constructor(game, opts) {
    super(game, opts)

    // this.sprites = {
    //   normal: require('../../../img/twochainz.png'),
    //   reverse: require('../../../img/twochainzreverse.png'),
    // }
    // this.spriteScale = 4

    this.speed = 3
    this.maxHealth = 800
    this.health = this.maxHealth
    this.takesDamage = false
    this.takesKnockback = false

    this.vector = getRandomVector(this.speed)

    this.attackCount = 0
    this.attackFrame = -240

    this.lootTable = _.pairs({
      SunglassesAdvil: .7,
      Diamonds: .7,
    })
  }

  move() {
    if (this.isAttacking && this.attackFrame < 150) return

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
      if (this.attackCount === 5) {
        this.status = STATUS.STUNNED
        this.takesDamage = true
        this.game.bodies.enemies.rihanna.setTarget(this)
        return
      }

      let v = getScaledVector(this.center, this.game.bodies.enemies.rihanna.center)
      let boundsPoint = getBoundsPoint(this.game.gameSize.x, this.game.gameSize.y, v)
      let size = 25
      for (var i = 0; i < 20; i++) {
        let start1 = {x: boundsPoint.x - i * size * v.y, y: boundsPoint.y + i * size * v.x}
        let end1 = getDestinationOfVector(start1, v, 1000)
        new Wave(this.game, start1, end1)

        let start2 = {x: boundsPoint.x + i * size * v.y, y: boundsPoint.y - i * size * v.x}
        let end2 = getDestinationOfVector(start2, v, 1000)
        new Wave(this.game, start2, end2)
      }
      playSound('wavesAttack')
      this.startAttack()
      this.attackCount++
    }

    this.attackFrame++

    if (this.attackFrame === 300) {
      this.attackFrame = 0
    }
  }

}
