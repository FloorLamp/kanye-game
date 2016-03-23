import { Song, playSound } from './sounds'

import HUD from './HUD'

import Enemy from './Enemy'
import Player from './Player'

export default class Game {

  constructor(...args) {
    var canvas = document.getElementById('canvas')
    this.screen = canvas.getContext('2d')
    this.gameSize = { x: canvas.width, y: canvas.height }

    this.gameStarted = false
    this.playerScore = -53000000
    this.song = new Song(this, 'titleScreen')

    this.bodies = {
      player: null,
      enemies: {},
      projectiles: {},
    }

    this.player = new Player(this)
    this.hud = new HUD(this)

    this.enemySpawnChance = .002

    var tick = () => {
      this.update()
      this.draw()

      requestAnimationFrame(tick)
    }
    tick()
  }

  updateScore(change) {
    this.playerScore += change
  }

  lose() {
    this.isLoss = true
  }

  spawnEnemy() {
    new Enemy(this)
  }

  update() {
    if (this.isLoss) return

    this.player.update()
    for (var body in this.bodies.enemies) {
      this.bodies.enemies[body].update()
    }
    for (var body in this.bodies.projectiles) {
      this.bodies.projectiles[body].update()
    }

    if (Math.random() < this.enemySpawnChance) {
      this.spawnEnemy()
    }
  }

  draw() {
    this.screen.clearRect(0, 0, this.gameSize.x, this.gameSize.y)

    this.hud.draw()

    this.player.draw()
    for (var body in this.bodies.enemies) {
      this.bodies.enemies[body].draw()
    }
    for (var body in this.bodies.projectiles) {
      this.bodies.projectiles[body].draw()
    }

    if (this.isLoss) {
      this.screen.fillStyle = 'red'
      this.screen.fillText('YOU LOSE', this.gameSize.x /2 , this.gameSize.y /2 )
      this.screen.fillStyle = 'black'
    }
  }
}
