import { drawRect } from '../Draw'
import { playSound } from '../sounds'
import { getDistance } from '../utils'
import { DIRECTIONS } from '../constants'

import Entity from '../Entity'
import Melee from '../weapons/Melee'
import Projectile from '../weapons/Projectile'

export default class Enemy extends Entity {

  constructor(game, opts) {
    super(game)

    this.id = opts.id || 'enemy' + Date.now().toString()
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
    this.isAttacking = false
    this.attackFrame = 0
    this.melee = null

    this.TYPES = {
      '2CHAINZ': 0,
    }

    if (!opts.type) {
      // var rand = Math.random()
      // if (rand < .5) opts.type = this.TYPES['2CHAINZ']
    }
    this.type = opts.type

    if (this.type === this.TYPES['2CHAINZ']) {
      this.speed = 3
      this.attackChance = .05
      // this.projectileSpeed = 3
      // this.projectileDamage = 3
    }
  }

  attack() {
    if (this.melee && this.game.bodies.objects[this.melee.id] === undefined) this.melee = null;

    if (getDistance(this.center, this.game.player.center) < 100 && this.melee === null) {
      this.melee = new Melee(this.game, this)
    }

    if (!this.isAttacking && Math.random() < this.attackChance) {
      if (this.type === this.TYPES['2CHAINZ']) {
        this.isAttacking = true
        new Projectile(this.game, this, this.game.player)
        playSound('twochainzAttack')
      }
    }
    if (this.isAttacking) {
      if (this.type === this.TYPES['2CHAINZ']) {
        if (this.attackFrame == 40) {
          new Projectile(this.game, this, this.game.player)
        }
      }
      this.attackFrame++

      if (this.attackFrame === 100) {
        this.isAttacking = false
        this.attackFrame = 0
      }
    }
  }

  takeDamage(damage) {
    this.health -= damage

    if (this.health <= 0) {
      this.game.updateScore(this.points)
      this.destroy()
    }
  }

  move() {
    this.direction = this.center.x < this.game.player.center.x ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT

    // move towards player
    let x = this.game.player.center.x
    if (this.direction == DIRECTIONS.RIGHT) x -= this.size.x // go towards either side of player
    else x += this.size.x
    let dx = x - this.center.x
    let dy = this.game.player.center.y - this.center.y
    let hypotenuse = getDistance(this.center, {x, y: this.game.player.center.y})
    this.vector = {
      x: dx / hypotenuse * this.speed,
      y: dy / hypotenuse * this.speed,
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
    this.attack()
    this.move()
  }

  draw() {
    drawRect(this.game.screen, this)
    if (this.health < this.maxHealth) {
      this.game.screen.fillStyle = 'green'
      let width = this.health / this.maxHealth * this.size.x
      this.game.screen.fillRect(this.center.x - this.size.x / 2, this.center.y - this.size.y / 2 - 5,
                                width, 3)
      this.game.screen.fillStyle = 'black'
    }

    if (this.melee && this.melee.isActive) {
      this.melee.draw()
    }
  }

  destroy() {
    this.game.enemyKilledCount++
    delete this.game.bodies.enemies[this.id]
  }

}