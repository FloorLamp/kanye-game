import { drawRect } from './Draw'

export default class HUD {

  constructor(game) {
    this.game = game
    this.DEFAULT_FONT = '25px Arial'
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
    this.game.screen.font = this.DEFAULT_FONT
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

  drawResult() {
    if (this.game.isLoss) {
      var gameoverKanyeImage = new Image();
      gameoverKanyeImage.src = require('../img/kanyegameover.png');

      this.game.screen.drawImage(gameoverKanyeImage, (this.game.gameSize.x /2) - 150 , (this.game.gameSize.y /2) - 200)

      this.game.screen.font = '40px Arial'
      this.game.screen.fillStyle = 'red'
      this.game.screen.fillText('YOU LOSE', (this.game.gameSize.x /2) - 100 , (this.game.gameSize.y /2) + 200)
      this.game.screen.font = this.DEFAULT_FONT
      this.game.screen.fillStyle = 'black'
    }
    if (this.game.gameEnded) {
      this.game.screen.fillStyle = 'green'
      this.game.screen.fillText('YOU WIN KIM!', this.game.gameSize.x /2 , this.game.gameSize.y /2 )
      this.game.screen.fillStyle = 'black'
    }
  }

  draw() {
    this.drawLevel()
    this.drawScore()
    this.drawHealth()
    this.drawResult()
  }
}
