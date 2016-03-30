import { playSound } from '../../sounds'
import { getRandomVector } from '../../utils'
import { DIRECTIONS } from '../../constants'

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

    this.speed = 2.5
    this.takesDamage = false
    this.postDestroyTargetFrame = 0

    this.target = null
    this.vector = getRandomVector(this.speed)
  }

  setTarget(target) {
    this.target = target
  }

  update() {
    if (this.target && !this.target.isAlive) {
      this.postDestroyTargetFrame++
      if (this.postDestroyTargetFrame === 120) this.destroy()
      return
    }

    this.attack()
    this.move()
  }

  destroy() {
    delete this.game.bodies.enemies[this.id]
  }
}
