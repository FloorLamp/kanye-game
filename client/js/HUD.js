import { drawRect } from './Draw'

export default class HUD {

  constructor(game) {
    this.game = game
  }

  drawLevel() {
    if (this.game.level == 0) return

    this.game.screen.fillStyle = 'green'
    this.game.screen.fillText((this.game.level).toString(), 25, 30)
    this.game.screen.fillStyle = 'black'
  }

  drawHealth() {
    if (this.game.player.health <= 0) return

    let maxWidth = 300
    let width = this.game.player.health / this.game.player.maxHealth * maxWidth

    this.game.screen.fillStyle = 'green'
    this.game.screen.fillRect(50, 20, width, 5)
    this.game.screen.fillStyle = 'black'
  }

  drawScore() {
    this.game.screen.font = '25px Arial'
    var scoreModifier = '-'
    if (this.game.playerScore >= 0) {
      this.game.screen.fillStyle = 'green'
      scoreModifier = ''
    } else {
      this.game.screen.fillStyle = 'red'
    }
    this.game.screen.fillText(scoreModifier + '$' + Math.abs(this.game.playerScore).toString(), canvas.width - 145, canvas.height - 570)

    this.game.screen.fillStyle = 'black'
  }

  draw() {
    this.drawLevel()
    this.drawScore()
    this.drawHealth()
  }
}
