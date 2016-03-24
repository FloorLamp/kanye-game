import { isColliding } from '../utils'
import { drawRect } from '../Draw'

import Weapon from './Weapon'

export default class Melee extends Weapon {

  constructor(game, source) {
    super(game, source)

    this.size = {
      x: 30,
      y: 30
    }

    this.speed = 10

    this.offset = {
      x: 0,
      y: 0,
    }

    this.center = {
      x: this.source.center.x,
      y: this.source.center.y,
    }
    this.direction = this.source.direction

    this.frame = 0
    this.isActive = true
    this.enemiesHit = new Set()

    this.damage = 5
  }

  update() {
    if (this.frame === 5) this.direction *= -1

    if (this.frame < 10) {
      this.offset.x += this.direction * this.speed

      this.center.x = this.source.center.x + this.offset.x
      this.center.y = this.source.center.y + this.offset.y

    } else {
      this.isActive = false
    }

    if (this.isActive) {
      // collision detection against enemies
      for (let enemyId in this.enemies) {
        if (enemyId == this.source.id || this.enemiesHit.has(enemyId)) continue

        let enemy = this.enemies[enemyId]

        if (isColliding(this, enemy)) {
          this.enemiesHit.add(enemyId)
          enemy.takeDamage(this.damage)
        }
      }
    }

    if (this.frame > 25) {
      this.destroy()
    }

    this.frame++
  }

  draw() {
    if (this.isActive) drawRect(this.game.screen, this)
  }

}
