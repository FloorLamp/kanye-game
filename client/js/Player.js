import { playSound } from './sounds';
import { drawRect } from './Draw';
import Fist from './weapons/Fist';

export default class Player {

  constructor(game) {
    this.KEYS = { UP: 87, DOWN: 83, LEFT: 65, RIGHT: 68, SPACE: 32 };
    this.DIRECTIONS = { RIGHT: 1, LEFT: -1 };

    this.game = game;

    this.size = {
      x: 40,
      y: 80
    }

    this.center = {
      x: 100,
      y: this.game.gameSize.y / 2
    }
    this.direction = this.DIRECTIONS.RIGHT;

    this.speed = 5;

    this.isAlive = true;
    this.maxHealth = 50;
    this.health = this.maxHealth;

    this.fist = null;

    var keyState = {};

    window.addEventListener('keydown', (e) => {
      if (!this.game.gameStarted) {
        this.game.gameStarted = true;
        this.game.song.playing = false;
        this.game.song.stopSong();
        playSound('startGame');
      }
      keyState[e.keyCode] = true;
    });

    window.addEventListener('keyup', (e) => {
      keyState[e.keyCode] = false;
    });

    this.isDown = function(keyCode) {
      return keyState[keyCode] === true;
    };
  }

  takeDamage(damage) {
    this.health -= damage;

    if (this.health <= 0) {
      this.isAlive = false;
      this.game.lose();
    }
  }

  startAttack() {
    this.fist = new Fist(this);
    playSound('attack');
  }

  destroyChild(name) {
    this[name] = null;
  }

  update() {
    if (!this.isAlive) return;

    if (this.isDown(this.KEYS.LEFT)) {
      this.center.x -= this.speed;
      this.direction = this.DIRECTIONS.LEFT;
    }
    if (this.isDown(this.KEYS.RIGHT)) {
      this.center.x += this.speed;
      this.direction = this.DIRECTIONS.RIGHT;
    }
    if (this.isDown(this.KEYS.UP)) this.center.y -= this.speed;
    if (this.isDown(this.KEYS.DOWN)) this.center.y += this.speed;

    if (this.isDown(this.KEYS.SPACE)) {
      if (this.fist === null) {
        this.startAttack();
      }
    }
    if (this.fist) {
      this.fist.update();
    }

    if (this.center.x < this.size.x / 2) this.center.x = this.size.x / 2;
    else if (this.center.x > this.game.gameSize.x - this.size.x / 2) this.center.x = this.game.gameSize.x - this.size.x / 2;
    if (this.center.y < this.size.y / 2) this.center.y = this.size.y / 2;
    else if (this.center.y > this.game.gameSize.y - this.size.y / 2) this.center.y = this.game.gameSize.y - this.size.y / 2;
  }

  draw() {
    drawRect(this.game.screen, this);

    if (this.fist && this.fist.isActive) {
      this.fist.draw(this.game.screen);
    }
  }
}
