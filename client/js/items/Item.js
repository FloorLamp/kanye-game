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
      x: 10,
      y: 10
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

    switch (this.type) {
      case 'MaybachKeys':
        this.sprite = require('../../img/maybachkey.png')
        this.spriteScale = 4
        this.sound = 'maybachKeys'
        break
      case 'Diamonds':
        this.sprite = require('../../img/diamond.png')
        this.spriteScale = 12
        this.sound = 'diamonds'
        break
      case 'SunglassesAdvil':
        this.sprite = require('../../img/sunglasses.png')
        this.sound = 'sunglasses'
        break
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

    } else if (this.type === 'Diamonds') {
      new Diamonds(this.game, this.game.player, {x: this.game.player.center.x, y: this.game.player.center.y - 1}) // N
      new Diamonds(this.game, this.game.player, {x: this.game.player.center.x - 1, y: this.game.player.center.y - 1}) // NW
      new Diamonds(this.game, this.game.player, {x: this.game.player.center.x - 1, y: this.game.player.center.y}) // W
      new Diamonds(this.game, this.game.player, {x: this.game.player.center.x - 1, y: this.game.player.center.y + 1}) // SW
      new Diamonds(this.game, this.game.player, {x: this.game.player.center.x, y: this.game.player.center.y + 1}) // S
      new Diamonds(this.game, this.game.player, {x: this.game.player.center.x + 1, y: this.game.player.center.y + 1}) // SE
      new Diamonds(this.game, this.game.player, {x: this.game.player.center.x + 1, y: this.game.player.center.y}) // E
      new Diamonds(this.game, this.game.player, {x: this.game.player.center.x + 1, y: this.game.player.center.y - 1}) // NE

    } else if (this.type === 'SunglassesAdvil') {
      this.game.player.heal(10)
    }

    if (this.sound) playSound(this.sound)

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
    let pos = this.center
    if (this.isPickedUp) {
      pos = {x: 410, y: 35}
    }

    if (this.sprite) {
      drawSprite(this.game.screen, pos, this.sprite, this.spriteScale)
    } else {
      this.game.screen.font = '8px sans-serif'
      this.game.screen.fillText(this.type, pos.x, pos.y)
    }
  }

  destroy() {
    if (this.isPickedUp)
      delete this.game.player.item
    else
      delete this.game.bodies.objects[this.id]
  }

}
