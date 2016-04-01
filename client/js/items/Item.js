import { isColliding, getScaledVector } from '../utils'
import { drawRect, drawSprite } from '../Draw'
import { playSound, Song } from '../sounds'

import Entity from '../Entity'
import BlackBalls from '../weapons/projectiles/BlackBalls'
import Diamonds from '../weapons/projectiles/Diamonds'
import MaybachKeys from '../weapons/projectiles/MaybachKeys'
import UltralightBeam from '../weapons/UltralightBeam'

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

    if (this.type === 'SunglassesAdvil') {
      this.isCollectible = false
    } else {
      this.isCollectible = true
    }

    switch (this.type) {
      case 'BlackBalls':
        // this.sprite = require('../../img/sunglasses.png')
        // this.sound = 'blackballs'
        break
      case 'UltralightBeam':
        this.sound = 'ultralight_beam'
        this.count = 600
        break
      case 'Diamonds':
        this.sprite = require('../../img/diamond.png')
        this.spriteScale = 12
        this.sound = 'diamonds'
        break
      case 'MaybachKeys':
        this.sprite = require('../../img/maybachkey.png')
        this.spriteScale = 4
        this.sound = 'maybachKeys'
        this.count = 2
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
      if (this.game.player.item) {
        if (this.game.player.item.type !== this.type) return false

        this.game.player.item.count += this.count
      }
      else this.game.player.item = this
    }
    else
      this.use()

    // return true if this needs to be deleted
    return true
  }

  use(isFirst) {
    if (this.type === 'MaybachKeys') {
      new MaybachKeys(this.game, this.game.player, this.game.mouse)

    } else if (this.type === 'BlackBalls') {
      if (!_.size(this.game.bodies.enemies)) return
      new BlackBalls(this.game, this.game.player, _.sample(this.game.bodies.enemies))

    } else if (this.type === 'UltralightBeam') {
      new UltralightBeam(this.game, this.game.player, getScaledVector(this.game.player.center, this.game.mouse))

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
      this.game.player.heal(20)
    }

    if (this.sound) {
      if (this.type === 'UltralightBeam') {
        if (isFirst) this.song = new Song(this.game, this.sound)
      }
      else playSound(this.sound)
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
    let pos = this.center
    if (this.isPickedUp) {
      pos = {x: 410, y: 35}
    }

    if (this.sprite) {
      drawSprite(this.game.screen, pos, this.sprite, this.spriteScale)
    } else {
      this.game.screen.font = '8px sans-serif'
      this.game.screen.fillStyle = 'black'
      this.game.screen.fillText(this.type, pos.x, pos.y)
    }

    if (this.isPickedUp && this.count > 1) {
      this.game.screen.font = '12px sans-serif'
      this.game.screen.fillStyle = 'white'
      this.game.screen.fillText(this.count, pos.x - 20, pos.y - 12)
    }

  }

  destroy() {
    if (this.song) this.song.stopSong()

    if (this.isPickedUp)
      delete this.game.player.item
    else
      delete this.game.bodies.objects[this.id]
  }

}
