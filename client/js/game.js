import { Song, playSound } from './sounds';
import Enemy from './Enemy';
import Player from './Player';

class Game {

  constructor(...args) {
    var canvas = document.getElementById('canvas');
    this.screen = canvas.getContext('2d');
    this.gameSize = { x: canvas.width, y: canvas.height };

    this.gameStarted = false;
    this.playerScore = -53000000;
    this.song = new Song(this, "titleScreen");

    this.bodies = {
      player: null,
      enemies: {},
      projectiles: {},
    };

    new Player(this);

    this.enemySpawnChance = .002;

    var tick = () => {
      this.update();
      this.draw();

      requestAnimationFrame(tick);
    }
    tick();
  }

  spawnEnemy() {
    new Enemy(this);
  }

  update() {
    this.player.update();
    for (var body in this.bodies.enemies) {
      this.bodies.enemies[body].update();
    }
    for (var body in this.bodies.projectiles) {
      this.bodies.projectiles[body].update();
    }

    if (Math.random() < this.enemySpawnChance) {
      this.spawnEnemy();
    }
  }

  draw() {
    this.screen.clearRect(0, 0, this.gameSize.x, this.gameSize.y);

    this.screen.font = '25px Arial';
    var scoreModifier = '-'
    if (this.playerScore >= 0) {
      this.screen.fillStyle = 'green';
      scoreModifier = ''
    } else {
      this.screen.fillStyle = 'red';
    }
    this.screen.fillText(scoreModifier + '$' + Math.abs(this.playerScore).toString(), canvas.width - 145, canvas.height - 570);

    this.screen.fillStyle = 'black';

    this.player.draw();
    for (var body in this.bodies.enemies) {
      this.bodies.enemies[body].draw();
    }
    for (var body in this.bodies.projectiles) {
      this.bodies.projectiles[body].draw();
    }
  }
}

export default Game;
