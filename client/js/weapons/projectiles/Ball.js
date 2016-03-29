import { isColliding, getScaledVector, getRandomVector } from '../../utils'
import { drawCircle, drawSprite } from '../../Draw'

import Weapon from '../Weapon'

export default class Ball extends Weapon {

  constructor(game, source) {
    super(game, source)

    this.size = {
      r: 15,
    }

    this.speed = 5

    this.sprite = null

    this.center = {
      x: source.center.x,
      y: source.center.y,
    }
    this.vector = getRandomVector(this.speed)

    this.isActive = true

    this.damage = 5

    this.bounces = 3
  }

  update() {
    this.center.x += this.vector.x
    this.center.y += this.vector.y

    if (this.center.x < this.size.r) {
      this.center.x = this.size.r
      this.vector.x *= -1
      this.bounces--
    } else if (this.center.x > this.game.gameSize.x - this.size.r) {
      this.center.x = this.game.gameSize.x - this.size.r
      this.vector.x *= -1
      this.bounces--
    }

    if (this.center.y < this.size.r) {
      this.center.y = this.size.r
      this.vector.y *= -1
      this.bounces--
    } else if (this.center.y > this.game.gameSize.y - this.size.r) {
      this.center.y = this.game.gameSize.y - this.size.r
      this.vector.y *= -1
      this.bounces--
    }

    if (this.bounces < 0) this.destroy()

    if (this.isActive) {
      // collision detection against enemies
      for (var enemyId in this.enemies) {
        if (enemyId == this.sourceId) continue

        var enemy = this.enemies[enemyId]

        if (isColliding(this, enemy)) {
          enemy.takeDamage(this.damage)
          this.destroy()
          return
        }
      }
    }
  }

  draw() {
    if (this.sprite) drawSprite(this.game.screen, this.center, this.sprite, this.spriteScale)
    else drawCircle(this.game.screen, this)
  }

}
