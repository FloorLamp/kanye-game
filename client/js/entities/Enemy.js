import { drawRect, drawSprite } from '../Draw'
import { playSound } from '../sounds'
import { getDistance, getScaledVector } from '../utils'
import { DIRECTIONS } from '../constants'

import Entity from '../Entity'
import Item from '../items/Item'
import Melee from '../weapons/Melee'

export default class Enemy extends Entity {

  constructor(game, opts) {
    super(game)

    if (opts === undefined) opts = {}

    this.sprites = {
      normal: require('../../img/twochainz.png'),
      reverse: require('../../img/twochainzreverse.png'),
    }
    this.spriteScale = 4

    this.id = opts.id || 'enemy' + Math.random()
    this.game.bodies.enemies[this.id] = this
    this.game.enemySpawnCount++

    this.size = {
      x: 40,
      y: 80
    }

    // spawn randomly
    if (!opts.center) {
      opts.center = {
        x: game.gameSize.x,
        y: Math.random() * game.gameSize.y
      }
    }
    this.center = opts.center

    // defaults
    this.speed = 2
    this.vector = null
    this.points = 1000000
    this.maxHealth = 15
    this.health = this.maxHealth
    this.attackChance = 0
    this.attackFrame = 0
    this.melee = null
    this.drawColor = 'black'
    this.takesKnockback = true

    this.lootTable = _.pairs({
      MaybachKeys: .4,
      SunglassesAdvil: .3,
      Diamonds: .2,
    })

  }

  get isAttacking() {
    return this.attackFrame > 0
  }

  getLoot() {
    let rand = Math.random()
    let loots = _.filter(this.lootTable, (item) => rand <= item[1])
    if (!loots.length) return null
    return _.sample(loots)[0]
  }

  startAttack() {
    this.attackFrame++
  }

  attack() {
    if (this.melee && this.game.bodies.objects[this.melee.id] === undefined) this.melee = null;

    if (getDistance(this.center, this.game.player.center) < 80 && !this.isAttacking) {
      this.startAttack()

    }

    if (this.isAttacking) {
      if (this.attackFrame === 15) this.drawColor = 'red'
      if (this.attackFrame === 30) {
        this.melee = new Melee(this.game, this)
        this.drawColor = 'black'
        // playSound('twochainzAttack')
      }

      this.attackFrame++

      if (this.attackFrame === 100) {
        this.attackFrame = 0
      }
    }
  }

  takeDamage(damage, opts) {
    this.health -= damage

    if (this.health <= 0) {
      this.game.updateScore(this.points)
      this.destroy()
    }

    if (!opts) return

    if (opts.source && opts.knockback && this.takesKnockback) {
      let kb = getScaledVector(opts.source.center, this.center, opts.knockback)
      this.center.x += kb.x
      this.center.y += kb.y
    }
  }

  get direction() {
    return this.center.x < this.game.player.center.x ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT
  }

  move() {
    // move towards player
    let x = this.game.player.center.x
    if (this.direction == DIRECTIONS.RIGHT) x -= (this.size.x + 10) // go towards either side of player
    else x += (this.size.x + 10)
    this.vector = getScaledVector(this.center, {x, y: this.game.player.center.y}, this.speed)

    this.center.x += this.vector.x
    this.center.y += this.vector.y

    // bounce off walls
    if (this.center.x < this.size.x / 2) {
      this.center.x = this.size.x / 2
      this.vector.x *= -1
    } else if (this.center.x > this.game.gameSize.x - this.size.x / 2) {
      this.center.x = this.game.gameSize.x - this.size.x / 2
      this.vector.x *= -1
    }

    if (this.center.y < this.size.y / 2) {
      this.center.y = this.size.y / 2
      this.vector.y *= -1
    } else if (this.center.y > this.game.gameSize.y - this.size.y / 2) {
      this.center.y = this.game.gameSize.y - this.size.y / 2
      this.vector.y *= -1
    }

  }

  update() {
    this.attack()
    this.move()
  }

  draw() {
    if (this.direction === DIRECTIONS.RIGHT) drawSprite(this.game.screen, this.center, this.sprites.normal, this.spriteScale)
    else drawSprite(this.game.screen, this.center, this.sprites.reverse, this.spriteScale)

    if (this.health < this.maxHealth) {
      this.game.screen.fillStyle = 'green'
      let width = this.health / this.maxHealth * this.size.x
      this.game.screen.fillRect(this.center.x - this.size.x / 2, this.center.y - this.size.y / 2 - 5, width, 3)
      this.game.screen.fillStyle = 'black'
    }

    if (this.melee && this.melee.isActive) {
      this.melee.draw()
    }
  }

  destroy() {
    let loot = this.getLoot()
    if (loot) new Item(this.game, {type: loot, source: this})

    this.game.enemyKilledCount++
    console.log(this.id, this.game.enemyKilledCount);
    delete this.game.bodies.enemies[this.id]
  }

}
