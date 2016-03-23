import { isColliding } from '../utils'
import { drawRect } from '../Draw'
import Player from '../Player'

export default class Melee {
  constructor(game, owner) {
    this.game = game
    this.owner = owner

    // determine who this damages
    if (this.owner instanceof Player) {
      this.enemies = this.game.bodies.enemies
    } else {
      this.enemies = [this.game.player]
    }

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
      x: this.owner.center.x,
      y: this.owner.center.y,
    }
    this.direction = this.owner.direction

    this.frame = 0
    this.isActive = true
    this.enemiesHit = new Set()

    this.damage = 5
  }

  destroy() {
    this.owner.melee = null
  }

  update() {
    if (this.frame === 5) this.direction *= -1

    if (this.frame < 10) {
      this.offset.x += this.direction * this.speed

      this.center.x = this.owner.center.x + this.offset.x
      this.center.y = this.owner.center.y + this.offset.y

    } else {
      this.isActive = false
    }

    if (this.isActive) {
      // collision detection against enemies
      for (let enemyId in this.enemies) {
        if (enemyId == this.owner.id || this.enemiesHit.has(enemyId)) continue

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
    drawRect(this.game.screen, this)
  }
}
