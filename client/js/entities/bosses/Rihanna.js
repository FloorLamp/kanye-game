import { playSound } from '../../sounds'
import { getDistance, getRandomVector } from '../../utils'
import { DIRECTIONS } from '../../constants'

import Enemy from '../Enemy'
import Umbrella from '../../weapons/Umbrella'

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

    playSound('rihanna_stand')
  }

  setTarget(target) {
    this.target = target
  }

  startAttack() {
    this.attackFrame = 1
    playSound('rihanna_ellaella')
  }

  attack() {
    if (this.isAttacking) {
      this.attackFrame++

      if (this.attackFrame === 100)
        this.melee = new Umbrella(this.game, this)

    } else {
      if (this.isInAttackingRange && !this.isAttacking) {
        this.startAttack()
      }
    }
  }

  update() {
    if (this.target) {
      if (!this.target.isAlive) {
        this.postDestroyTargetFrame++
        if (this.postDestroyTargetFrame === 90) this.destroy()
        return
      }

      this.attack()
    }

    if (!this.isAttacking) this.move()
  }

  destroy() {
    delete this.game.bodies.enemies[this.id]
  }
}
