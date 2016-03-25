import { isColliding, getScaledVector } from '../../utils'
import { drawRect, drawSprite } from '../../Draw'

import Weapon from '../Weapon'

export default class Projectile extends Weapon {

  constructor(game, source, destination, opts) {
    super(game, source, opts)

    this.size = {
      x: 5,
      y: 5
    }

    this.speed = 5

    this.sprite = null

    this.center = {
      x: source.center.x,
      y: source.center.y,
    }
    this.vector = getScaledVector(source.center, destination, this.speed)

    this.isActive = true

    this.damage = 5
  }

  update() {
    this.center.x += this.vector.x
    this.center.y += this.vector.y

    if (this.center.x >= this.game.gameSize.x + this.size.x / 2 ||
        this.center.x <= -this.size.x / 2 ||
        this.center.y >= this.game.gameSize.y + this.size.y / 2 ||
        this.center.y <= -this.size.y / 2) {
      this.destroy()
      return
    }


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
    else drawRect(this.game.screen, this)
  }

}
