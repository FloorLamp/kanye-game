import { playSound } from '../../sounds'
import { getScaledVector, getRandomVector, getBoundsPoint, getDestinationOfVector } from '../../utils'

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

    this.speed = 2
    this.maxHealth = 50
    this.health = this.maxHealth
    this.takesDamage = false

    this.vector = getRandomVector(this.speed)

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
      let vectorToPlayer = getScaledVector(this.center, this.game.player.center)
      let boundsPoint = getBoundsPoint(this.game.gameSize.x, this.game.gameSize.y, vectorToPlayer)
      let size = 25
      for (var i = 0; i < 20; i++) {
        let start1 = {x: boundsPoint.x - i * size * vectorToPlayer.y, y: boundsPoint.y + i * size * vectorToPlayer.x}
        let end1 = getDestinationOfVector(start1, vectorToPlayer, 1000)
        new Wave(this.game, start1, end1)

        let start2 = {x: boundsPoint.x + i * size * vectorToPlayer.y, y: boundsPoint.y - i * size * vectorToPlayer.x}
        let end2 = getDestinationOfVector(start2, vectorToPlayer, 1000)
        new Wave(this.game, start2, end2)
      }
      playSound('jayzAttack')
    }

    this.attackFrame++

    if (this.attackFrame === 300) {
      this.attackFrame = 0
    }
  }

}
