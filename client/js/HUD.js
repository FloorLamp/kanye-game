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

  drawItem() {
    if (!this.game.player.item) return

    this.game.screen.strokeRect(385, 10, 50, 50)
    this.game.screen.font = '8px sans-serif'
    this.game.screen.fillText(this.game.player.item.type, 400, 30)
    this.game.screen.font = '25px Arial'
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
  }

  drawMessage() {
    this.game.screen.font = '25px Arial'
    if (this.game.isLoss) {
      this.game.screen.fillStyle = 'red'
      this.game.screen.fillText('YOU LOSE', this.game.gameSize.x /2 , this.game.gameSize.y /2 )
    }
    if (this.game.gameEnded) {
      this.game.screen.fillStyle = 'green'
      this.game.screen.fillText('YOU WIN KIM!', this.game.gameSize.x /2 , this.game.gameSize.y /2 )
    }
    this.game.screen.fillStyle = 'black'
  }

  draw() {
    this.drawLevel()
    this.drawScore()
    this.drawHealth()
    this.drawItem()

    this.drawMessage()
  }
}
