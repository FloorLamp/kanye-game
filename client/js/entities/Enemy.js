import { drawRect, drawSprite } from '../Draw'
import { playSound } from '../sounds'
import { getDistance, getScaledVector } from '../utils'
import { DIRECTIONS, STATUS } from '../constants'

import Entity from '../Entity'
import Item from '../items/Item'
import Melee from '../weapons/Melee'

export default class Enemy extends Entity {

  constructor(game, opts) {
    super(game)

    if (opts === undefined) opts = {}

    // this.sprites = {
    //   normal: require('../../img/twochainz.png'),
    //   reverse: require('../../img/twochainzreverse.png'),
    // }
    // this.spriteScale = 4

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
    this.target = this.game.player
    this.status = null
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
    this.takesDamage = true
    this.deathFrame = 0
    this.deathFrames = 60

    this.lootTable = _.pairs({
      MaybachKeys: .2,
      SunglassesAdvil: .1,
      Diamonds: .1,
    })

  }

  get isAlive() {
    return this.health > 0
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
    this.attackFrame = 1
  }

  attack() {
    if (!this.target) return

    if (this.melee && this.game.bodies.objects[this.melee.id] === undefined) this.melee = null;

    if (this.isInAttackingRange && !this.isAttacking) {
      this.startAttack()
    }

    if (this.isAttacking) {
      if (this.attackFrame === 15) this.drawColor = 'red'
      if (this.attackFrame === 30) {
        this.melee = new Melee(this.game, this)
        this.drawColor = 'black'
      }

      this.attackFrame++

      if (this.attackFrame === 100) {
        this.attackFrame = 0
      }
    }
  }

  takeDamage(damage, opts) {
    if (!this.takesDamage) return

    this.health -= damage

    if (!this.isAlive) {
      this.game.updateScore(this.points)
    }

    if (!opts) return

    if (opts.source && opts.knockback && this.takesKnockback) {
      let kb = getScaledVector(opts.source.center, this.center, opts.knockback)
      this.center.x += kb.x
      this.center.y += kb.y
    }
  }

  get direction() {
    if (!this.target) return DIRECTIONS.LEFT
    return this.center.x < this.target.center.x ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT
  }

  move() {
    // move towards target
    if (this.target) {
      let x = this.target.center.x
      if (this.direction == DIRECTIONS.RIGHT) x -= (this.size.x + 10) // go towards either side of target
      else x += (this.size.x + 10)

      let destination = {x, y: this.target.center.y}
      let distance = getDistance(this.center, destination)

      this.isInAttackingRange = false

      if (distance === 0) {
        this.vector = {x: 0, y: 0}
        this.isInAttackingRange = true
      } else if (distance < this.speed)
        this.vector = getScaledVector(this.center, destination, distance)
      else
        this.vector = getScaledVector(this.center, destination, this.speed)
    }

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
    if (!this.isAlive) {
      this.deathFrame++
      if (this.deathFrame === this.deathFrames) this.destroy()
      return
    }
    if (this.status === STATUS.STUNNED) return

    if (this.target && this.target.isAlive) this.attack()
    this.move()
  }

  draw() {
    if (!this.isAlive && this.deathFrame % 12 === 0) return

    if (this.sprites) {
      if (this.direction === DIRECTIONS.RIGHT) drawSprite(this.game.screen, this.center, this.sprites.normal, this.spriteScale)
      else drawSprite(this.game.screen, this.center, this.sprites.reverse, this.spriteScale)
    } else {
      drawRect(this.game.screen, this)
    }

    if (this.isAlive && this.health < this.maxHealth) {
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
