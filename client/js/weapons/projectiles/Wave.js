import { isColliding, getDistance, getScaledVector } from '../../utils'
import { drawRect, drawSprite } from '../../Draw'

import Weapon from '../Weapon'

export default class Wave extends Weapon {

  constructor(game, source, destination) {
    super(game)

    this.size = {
      x: 20,
      y: 20
    }

    this.speed = 5

    this.sprite = null

    this.center = {
      x: source.x,
      y: source.y,
    }
    this.vector = getScaledVector(source, destination, this.speed)

    this.isActive = true

    this.damage = 5
    this.frame = 0

    this.enemies = {
      player: this.game.player
    }
  }

  update() {
    this.frame++
    this.center.x += this.vector.x
    this.center.y += this.vector.y

    if (this.frame > 240) {
      console.log('destroy');
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
