import { Song, playSound } from './sounds'
import { drawLine } from './Draw'
import { getBoundsPoint } from './utils'

import HUD from './HUD'

import Enemy from './entities/Enemy'
import BigSean from './entities/bosses/BigSean'
import Chance from './entities/bosses/Chance'
import ChiefKeef from './entities/bosses/ChiefKeef'
import ChrisBrown from './entities/bosses/ChrisBrown'
import Rihanna from './entities/bosses/Rihanna'
import TwoChainz from './entities/bosses/TwoChainz'
import JayZ from './entities/bosses/JayZ'
import Player from './entities/Player'

export default class Game {

  constructor(...args) {
    var canvas = document.getElementById('canvas')
    this.screen = canvas.getContext('2d')
    this.gameSize = { x: canvas.width, y: canvas.height }

    this.gameStarted = false
    this.playerScore = -53000000
    this.song = new Song(this, 'titleScreen')
    this.song.stopSong() // REMOVE TO PLAY SONG

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
    this.bossSpawned = false
    this.level++
    if (this.level !== 1 && !this.gameEnded) playSound('endoflevel')

    setTimeout(() => {
      for (var i = 0; i < this.level * 2; i++) {
        new Enemy(this);
      }
    }, 1000)
    setTimeout(() => {
      for (var i = 0; i < this.level * 4; i++) {
        new Enemy(this);
      }
    }, 5000)
    // new ChrisBrown(this)
    // new Rihanna(this)
    // new Chance(this)
    console.log('need', _.sum(_.range(this.level + 1)) * 6 + this.level);
  }

  spawnBoss() {
    if (this.bossSpawned) return

    this.bossSpawned = true
    switch (this.level) {
      case 1:
        new TwoChainz(this);
        break
      case 2:
        new BigSean(this);
        break
      case 3:
        new ChiefKeef(this);
        break
      case 4:
        new ChrisBrown(this)
        new Rihanna(this)
        break
      case 5:
        new Chance(this);
        break
      default:
        new JayZ(this);
    }
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
    else if (this.level >= 1 && this.enemyKilledCount === _.sum(_.range(this.level + 1)) * 6 + this.level - 1) this.spawnBoss()
    else if (this.level >= 1 && this.enemyKilledCount === _.sum(_.range(this.level + 1)) * 6 + this.level) this.nextLevel()
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
    if (this.drawFrom) {
      drawLine(this.screen, this.drawFrom, this.drawTo)
    }
  }
}
