import { isColliding, getDistance } from '../utils';
import { drawRect } from '../Draw';

export default class Projectile {
  constructor(game, source, destination) {
    this.game = game;
    this.sourceId = source.id;

    this.id = 'projectile' + Date.now().toString();
    this.game.bodies.projectiles[this.id] = this;

    this.size = {
      x: 5,
      y: 5
    }

    this.speed = 6;

    this.center = {
      x: source.center.x,
      y: source.center.y,
    }
    var distance = getDistance(source.center, destination.center);
    this.vector = {
      x: (destination.center.x - this.center.x) / distance * this.speed,
      y: (destination.center.y - this.center.y) / distance * this.speed,
    }

    this.isActive = true;

    this.damage = 2;
  }

  destroy() {
    delete this.game.bodies.projectiles[this.id];
  }

  update() {
    this.center.x += this.vector.x;
    this.center.y += this.vector.y;

    if (this.center.x >= this.game.gameSize.x + this.size.x / 2 ||
        this.center.x <= -this.size.x / 2 ||
        this.center.y >= this.game.gameSize.y + this.size.y / 2 ||
        this.center.y <= -this.size.y / 2) {
      this.destroy()
      return;
    }


    if (this.isActive) {
      // collision detection against enemies
      for (var enemyId in this.game.bodies.enemies) {
        if (enemyId == this.sourceId) continue;

        var enemy = this.game.bodies.enemies[enemyId];

        if (isColliding(this, enemy)) {
          enemy.takeDamage(this.damage);
          this.destroy();
          return;
        }
      }

      if (isColliding(this, this.game.player)) {
        this.game.player.takeDamage(this.damage);
        this.destroy();
      }
    }
  }

  draw() {
    drawRect(this.game.screen, this);
  }
}

