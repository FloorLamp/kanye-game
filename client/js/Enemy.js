import { drawRect } from './Draw';
import Projectile from './weapons/Projectile';

export default class Enemy {
  constructor(game, type, center) {
    this.game = game;

    this.id = 'enemy' + Date.now().toString();
    this.game.bodies.enemies[this.id] = this;

    this.size = {
      x: 40,
      y: 80
    }

    // spawn randomly
    if (!center) {
      center = {
        x: game.gameSize.x,
        y: Math.random() * game.gameSize.y
      }
    }
    this.center = center;

    // defaults
    this.speed = 4;
    this.vector = null;
    this.points = 1000000;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.attackChance = 0;
    this.isAttacking = false;
    this.attackFrame = 0;

    this.TYPES = {
      '2CHAINZ': 0,
    }

    if (!type) {
      var rand = Math.random();
      if (rand < .5) type = this.TYPES['2CHAINZ'];
    }
    this.type = type;

    if (this.type === this.TYPES['2CHAINZ']) {
      this.speed = 3;
      this.attackChance = .5;
      // this.projectileSpeed = 3;
      // this.projectileDamage = 3;
    }
  }

  attack() {
    if (this.game.player.health <= 0) return

    if (!this.isAttacking && Math.random() < this.attackChance) {
      if (this.type === this.TYPES['2CHAINZ']) {
        this.isAttacking = true;
        new Projectile(this.game, this, this.game.player);
      }
    }
    if (this.isAttacking) {
      if (this.type === this.TYPES['2CHAINZ']) {
        if (this.attackFrame == 20) {
          new Projectile(this.game, this, this.game.player);
        }
      }
      this.attackFrame++;

      if (this.attackFrame === 100) {
        this.isAttacking = false;
        this.attackFrame = 0;
      }
    }
  }

  takeDamage(damage) {
    this.health -= damage;

    if (this.health <= 0) {
      this.game.updateScore(this.points);
      this.destroy();
    }
  }

  move() {
    // randomly pick a vector
    if (!this.vector) {
      this.vector = {
        x: (Math.random() - 1) * this.speed,
        y: (Math.random() - 1) * this.speed,
      }
    }

    this.center.x += this.vector.x;
    this.center.y += this.vector.y;

    // bounce off walls
    if (this.center.x < this.size.x / 2) {
      this.center.x = this.size.x / 2;
      this.vector.x *= -1;
    } else if (this.center.x > this.game.gameSize.x - this.size.x / 2) {
      this.center.x = this.game.gameSize.x - this.size.x / 2;
      this.vector.x *= -1;
    }

    if (this.center.y < this.size.y / 2) {
      this.center.y = this.size.y / 2;
      this.vector.y *= -1;
    } else if (this.center.y > this.game.gameSize.y - this.size.y / 2) {
      this.center.y = this.game.gameSize.y - this.size.y / 2;
      this.vector.y *= -1;
    }

  }

  update() {
    this.attack();
    this.move();
  }

  draw() {
    drawRect(this.game.screen, this);
    if (this.health < this.maxHealth) {
      this.game.screen.fillStyle = 'green';
      let width = this.health / this.maxHealth * this.size.x;
      this.game.screen.fillRect(this.center.x - this.size.x / 2, this.center.y - this.size.y / 2 - 5,
                                width, 3);
      this.game.screen.fillStyle = 'black';
    }
  }

  destroy() {
    delete this.game.bodies.enemies[this.id];
  }
}
