import { isColliding } from '../utils'
import { drawRect, drawSprite } from '../Draw'
import { playSound } from '../sounds'

import Entity from '../Entity'
import MaybachKeys from '../weapons/projectiles/MaybachKeys'
import Diamonds from '../weapons/projectiles/Diamonds'

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

    if (this.type === 'MaybachKeys' ||
        this.type === 'Diamonds') {
      this.isCollectible = true
    } else if (this.type === 'SunglassesAdvil') {
      this.isCollectible = false
    }
  }

  get isPickedUp() {
    return this.game.player.item == this
  }

  pickup() {
    if (this.isCollectible) {
      if (this.game.player.item) return false

      this.game.player.item = this
    }
    else
      this.use()

    // return true if this needs to be deleted
    return true
  }

  use() {
    if (this.type === 'MaybachKeys') {
      new MaybachKeys(this.game, this.game.player, this.game.mouse)
      playSound('maybachKeys')

    } else if (this.type === 'Diamonds') {
      new Diamonds(this.game, this.game.player, {x: this.game.player.center.x, y: this.game.player.center.y - 10}, {id: 'diamond-0'}) // up
      new Diamonds(this.game, this.game.player, {x: this.game.player.center.x - 10, y: this.game.player.center.y - 10}, {id: 'diamond-1'}) // left
      new Diamonds(this.game, this.game.player, {x: this.game.player.center.x + 10, y: this.game.player.center.y - 10}, {id: 'diamond-2'}) // right

    } else if (this.type === 'SunglassesAdvil') {
      this.game.player.heal(10)
      playSound('sunglasses')
    }

    this.count--
    if (this.count <= 0)
      this.destroy()
  }

  update() {
    if (isColliding(this, this.game.player)) {
      if (this.pickup())
        delete this.game.bodies.objects[this.id]
    }
  }

  draw() {
    if (!this.isPickedUp) {
      if (this.type === 'MaybachKeys') {
        drawSprite(this.game.screen, this, require('../../img/maybachkey.png'), 4)
      }else if (this.type === 'SunglassesAdvil') {
        drawSprite(this.game.screen, this, require('../../img/sunglasses.png'), 1)
      } else {
        this.game.screen.font = '8px sans-serif'
        this.game.screen.fillText(this.type, this.center.x, this.center.y)
      }
    }
  }

  destroy() {
    if (this.isPickedUp)
      delete this.game.player.item
    else
      delete this.game.bodies.objects[this.id]
  }

}
