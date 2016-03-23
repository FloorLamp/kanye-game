import { isColliding, getDistance } from '../utils'
import { drawRect } from '../Draw'
import Player from '../Player'

export default class Projectile {
  constructor(game, source, destination) {
    this.game = game
    this.sourceId = source.id

    // determine who this damages
    if (source instanceof Player) {
      this.enemies = this.game.bodies.enemies
    } else {
      this.enemies = [this.game.player]
    }

    this.id = 'projectile' + Date.now().toString()
    this.game.bodies.projectiles[this.id] = this

    this.size = {
      x: 5,
      y: 5
    }

    this.speed = 6

    this.center = {
      x: source.center.x,
      y: source.center.y,
    }
    var distance = getDistance(source.center, destination.center)
    this.vector = {
      x: (destination.center.x - this.center.x) / distance * this.speed,
      y: (destination.center.y - this.center.y) / distance * this.speed,
    }

    this.isActive = true

    this.damage = 2
  }

  destroy() {
    delete this.game.bodies.projectiles[this.id]
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

