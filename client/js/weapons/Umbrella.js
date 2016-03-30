import { isColliding } from '../utils'
import { drawRect } from '../Draw'

import Melee from './Melee'

export default class Umbrella extends Melee {

  constructor(game, source) {
    super(game, source)

    this.size = {
      x: 50,
      y: 10
    }

    this.speed = 5

    this.offset = {
      x: 0,
      y: 0,
    }

    this.center = {
      x: this.source.center.x + this.size.x / 2,
      y: this.source.center.y + this.size.y / 2,
    }
    this.direction = this.source.direction

    this.frame = 0
    this.isActive = true
    this.enemiesHit = new Set()
    this.count = 0

    this.damage = 100
    this.knockback = 40
  }

  update() {
    if (this.frame === 5) this.direction *= -1

    if (this.frame < 10) {
      this.offset.x += this.direction * this.speed

      this.center.x = this.source.center.x + this.offset.x
      this.center.y = this.source.center.y + this.offset.y
    }

    if (this.isActive) {
      // collision detection against enemies
      for (let enemyId in this.enemies) {
        if (enemyId == this.source.id || this.enemiesHit.has(enemyId)) continue

        let enemy = this.enemies[enemyId]

        if (isColliding(this, enemy)) {
          this.enemiesHit.add(enemyId)
          enemy.takeDamage(this.damage, {source: this.source, knockback: this.knockback})
        }
      }
    }

    if (this.frame === 38) {
      this.frame = 0
      this.enemiesHit = new Set()
      this.direction = this.source.direction
      this.count++
    } else {
      this.frame++
    }

    if (this.count === 8) this.destroy()
  }

  draw() {
    if (this.isActive) drawRect(this.game.screen, this)
  }

}
