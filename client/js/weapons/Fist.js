import { isColliding } from '../utils';
import { drawRect } from '../Draw';

export default class Fist {
  constructor(entity) {
    this.entity = entity;

    this.size = {
      x: 30,
      y: 30
    }

    this.speed = 10;

    this.offset = {
      x: 0,
      y: 0,
    }

    this.center = {
      x: this.entity.center.x,
      y: this.entity.center.y,
    }
    this.direction = this.entity.direction;

    this.frame = 0;
    this.isActive = true;

    this.damage = 2;
  }

  destroy() {
    this.entity.destroyChild('fist');
  }

  update() {
    if (this.frame === 5) this.direction *= -1;

    if (this.frame < 10) {
      this.offset.x += this.direction * this.speed;

      this.center.x = this.entity.center.x + this.offset.x;
      this.center.y = this.entity.center.y + this.offset.y;

    } else {
      this.isActive = false;
    }

    if (this.isActive) {
      // collision detection against enemies
      for (var enemyId in this.entity.game.bodies.enemies) {
        var enemy = this.entity.game.bodies.enemies[enemyId];

        if (isColliding(this, enemy)) {
          enemy.takeDamage(this.damage);
        }
      }
    }

    if (this.frame > 25) {
      this.destroy();
    }

    this.frame++;
  }

  draw(screen) {
    drawRect(screen, this);
  }
}
