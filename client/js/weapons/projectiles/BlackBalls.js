import { isColliding, getScaledVector, getRandomVector } from '../../utils'
import { drawCircle, drawSprite } from '../../Draw'
import { playSound } from '../../sounds'
import { STATUS } from '../../constants'

import Weapon from '../Weapon'

export default class BlackBalls extends Weapon {

  constructor(game, source, target) {
    super(game, source)

    this.size = {
      r: 15,
    }

    this.speed = 4

    this.sprite = null

    this.center = {
      x: source.center.x,
      y: source.center.y,
    }
    this.target = target

    this.isActive = true
  }

  update() {
    if (!this.target.isAlive) {
      this.destroy()
      return
    }

    if (this.isAttacking) {
      this.center.x = this.target.center.x
      this.center.y = this.target.center.y - this.target.size.y / 2 + 5 * Math.sin(this.attackFrame / 30 * 2 * Math.PI)
      this.attackFrame++

      if (this.attackFrame === 340) {
        this.destroy()
        this.target.status = null
      }

      return
    }

    this.vector = getScaledVector(this.center, this.target.center, this.speed)

    this.center.x += this.vector.x
    this.center.y += this.vector.y

    if (isColliding(this, this.target)) {
      this.target.status = STATUS.STUNNED
      this.attackFrame++
      playSound('blackballs')
    }
  }

  draw() {
    if (this.sprite) drawSprite(this.game.screen, this.center, this.sprite, this.spriteScale)
    else drawCircle(this.game.screen, this)
  }

}
