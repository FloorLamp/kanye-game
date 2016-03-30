import { drawRect } from '../Draw'

import Entity from '../Entity'

export default class Weapon extends Entity {

  constructor(game, source, opts) {
    if (new.target === Weapon) throw new TypeError()

    super(game)

    if (!opts) opts = {}

    this.id = opts.id || `weapon-${Math.random()}`

    if (source) {
      this.source = source
      this.sourceId = source.id

      // determine who this damages
      if (this.source.id === 'player' || this.source.id === 'rihanna') {
        this.enemies = this.game.bodies.enemies
      } else {
        this.enemies = [this.game.player]
      }

      this.id = this.source.id + this.id
    }

    this.game.bodies.objects[this.id] = this
    this.attackFrame = 0
  }

  get isAttacking() {
    return this.attackFrame > 0
  }

  destroy() {
    delete this.game.bodies.objects[this.id]
  }

}
