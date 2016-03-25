import { isColliding, getDistance } from '../../utils'
import { drawRect } from '../../Draw'

import Weapon from '../Weapon'

export default class Projectile extends Weapon {

  constructor(game, source, destination) {
    super(game, source)

    this.size = {
      x: 5,
      y: 5
    }

    this.speed = 6

    this.center = {
      x: source.center.x,
      y: source.center.y,
    }
    var distance = getDistance(source.center, destination)
    this.vector = {
      x: (destination.x - this.center.x) / distance * this.speed,
      y: (destination.y - this.center.y) / distance * this.speed,
    }

    this.isActive = true

    this.damage = 10
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
    drawRect(this.game.screen, this)
  }

}
