import { Song, playSound } from './sounds'

import HUD from './HUD'

import Enemy from './entities/Enemy'
import Player from './entities/Player'

export default class Game {

  constructor(...args) {
    var canvas = document.getElementById('canvas')
    this.screen = canvas.getContext('2d')
    this.gameSize = { x: canvas.width, y: canvas.height }

    this.gameStarted = false
    this.playerScore = -53000000
    this.song = new Song(this, 'titleScreen')
    // this.song.stopSong() // REMOVE TO PLAY SONG

    this.bodies = {
      player: null,
      enemies: {},
      objects: {},
    }


    this.player = new Player(this)
    this.hud = new HUD(this)

    this.level = 0
    this.enemySpawnCount = 0
    this.enemyKilledCount = 0

    this.enemySpawnChance = .002

    var tick = () => {
      this.update()
      this.draw()

      requestAnimationFrame(tick)
    }
    tick()

    this.mouse = {
      x: 0,
      y: 0,
    }
    canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.offsetX
      this.mouse.y = e.offsetY
    })
  }

  nextLevel() {
    this.level++
    if (this.level !== 1 && !this.gameEnded) playSound('endoflevel')

    setTimeout(() => {
      for (var i = 0; i < this.level; i++) {
        new Enemy(this);
      }
    }, 1000)
    setTimeout(() => {
      for (var i = 0; i < this.level * 2; i++) {
        new Enemy(this);
      }
    }, 5000)
    setTimeout(() => {
      for (var i = 0; i < this.level * 3; i++) {
        new Enemy(this);
      }
    }, 10000)

  }

  endGame() {
    this.gameEnded = true
    this.song.updateSong('gameEnd')
  }

  checkConditions() {
    if (!this.gameStarted && this.player.isMoving) {
      this.gameStarted = true
      this.song.playing = false
      this.song.stopSong()
      playSound('startGame')
    }

    if (this.gameStarted && this.level === 0) this.nextLevel();
    else if (this.level >= 1 && this.enemyKilledCount === _.sum(_.range(this.level + 1)) * 6) this.nextLevel()
  }

  updateScore(change) {
    this.playerScore += change
  }

  lose() {
    this.isLoss = true
    this.song.updateSong('gameOver')
  }

  update() {
    if (this.isLoss || this.gameEnded) return

    this.checkConditions()

    this.player.update()
    for (let body in this.bodies.enemies) {
      this.bodies.enemies[body].update()
    }
    for (let body in this.bodies.objects) {
      this.bodies.objects[body].update()
    }
  }

  draw() {
    this.screen.clearRect(0, 0, this.gameSize.x, this.gameSize.y)

    this.hud.draw()

    this.player.draw()
    for (let body in this.bodies.enemies) {
      this.bodies.enemies[body].draw()
    }
    for (let body in this.bodies.objects) {
      this.bodies.objects[body].draw()
    }
  }
}
