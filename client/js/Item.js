import { isColliding } from './utils'
import { drawRect } from './Draw'

import Entity from './Entity'
import MaybachKeys from './weapons/projectiles/MaybachKeys'

export default class Item extends Entity {

  constructor(game, opts) {
    if (!opts || !opts.type || !opts.source) throw new Error('opts not provided')

    super(game)

    this.id = `item-${Date.now()}`
    this.game.bodies.objects[this.id] = this

    this.size = {
      x: 5,
      y: 5
    }

    this.center = {
      x: opts.source.center.x,
      y: opts.source.center.y,
    }

    this.type = opts.type
    this.count = 1
  }

  get isPickedUp() {
    return this.game.player.item == this
  }

  pickup() {
    this.game.player.item = this
  }

  use() {
    if (this.type === 'MaybachKeys') {
      new MaybachKeys(this.game, this.game.player, this.game.mouse)
    }

    this.count--
    if (this.count <= 0)
      this.destroy()
  }

  update() {
    if (isColliding(this, this.game.player)) {
      this.pickup()
      delete this.game.bodies.objects[this.id]
    }
  }

  draw() {
    if (!this.isPickedUp) {
      this.game.screen.font = '8px sans-serif'
      this.game.screen.fillText(this.type, this.center.x, this.center.y)
    }
  }

  destroy() {
    if (this.isPickedUp)
      delete this.game.player.item
    else
      delete this.game.bodies.objects[this.id]
  }

}
