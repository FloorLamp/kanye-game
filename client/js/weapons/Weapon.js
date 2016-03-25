import { drawRect } from '../Draw'

import Entity from '../Entity'

export default class Weapon extends Entity {

  constructor(game, source) {
    if (new.target === Weapon) throw new TypeError()

    super(game)

    this.id = `weapon-${Date.now()}`

    if (source) {
      this.source = source
      this.sourceId = source.id

      // determine who this damages
      if (this.source.id === 'player') {
        this.enemies = this.game.bodies.enemies
      } else {
        this.enemies = [this.game.player]
      }

      this.id = this.source.id + this.id
    }

    this.game.bodies.objects[this.id] = this
  }

  destroy() {
    delete this.game.bodies.objects[this.id]
  }

}
