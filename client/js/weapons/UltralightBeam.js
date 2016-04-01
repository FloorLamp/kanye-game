import { isColliding, isInside } from '../utils'
import { drawLine, drawCircle } from '../Draw'

import Weapon from './Weapon'

export default class UltralightBeam extends Weapon {

  constructor(game, source, vector) {
    super(game, source, {id: 'ultralightbeam'})

    this.center = {
      x: this.source.center.x,
      y: this.source.center.y,
    }
    this.destination = {
      x: this.center.x + (vector.x * 1000),
      y: this.center.y + (vector.y * 1000),
    }
    this.m = vector.y / vector.x
    this.drawColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`

    this.endFrame = 0
    this.isActive = true
    this.damage = .5
    this.ignoresInvincibility = true
  }

  isColliding(enemy) {
    if (!isInside(enemy.center.x, this.center.x, this.destination.x)) return

    let x0 = (enemy.center.x - enemy.size.x / 2) - this.center.x
    let y0 = this.center.y + this.m * x0
    if (y0 >= enemy.center.y - enemy.size.y / 2 && y0 <= enemy.center.y + enemy.size.y / 2) return true

    let x1 = (enemy.center.x + enemy.size.x / 2) - this.center.x
    let y1 = this.center.y + this.m * x1
    if (y1 >= enemy.center.y - enemy.size.y / 2 && y1 <= enemy.center.y + enemy.size.y / 2) return true

    return false
  }

  update() {
    if (this.isActive) {
      // collision detection against enemies
      for (let enemyId in this.enemies) {
        if (enemyId == this.source.id) continue

        let enemy = this.enemies[enemyId]

        if (this.isColliding(enemy)) {
          enemy.takeDamage(this.damage, {source: this.source, ignoresInvincibility: this.ignoresInvincibility})
        }
      }
    }

    this.isActive = false
    this.endFrame++
    if (this.endFrame === 8) this.destroy()
  }

  draw() {
    drawLine(this.game.screen, this.center, this.destination, this.drawColor)
  }

}
