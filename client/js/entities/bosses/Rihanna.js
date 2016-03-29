import { playSound } from '../../sounds'
import { getRandomVector } from '../../utils'

import Enemy from '../Enemy'

export default class Rihanna extends Enemy {

  constructor(game) {
    super(game, {id: 'rihanna'})

    // this.sprites = {
    //   normal: require('../../../img/twochainz.png'),
    //   reverse: require('../../../img/twochainzreverse.png'),
    // }
    // this.spriteScale = 4

    this.drawColor = 'pink'

    this.speed = 2
    this.takesDamage = false

    this.vector = getRandomVector(this.speed)
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

  attack() {}

}
