import Projectile from './Projectile'

export default class Diamonds extends Projectile {

  constructor(game, source, destination) {
    super(game, source, destination)

    this.sprite = require('../../../img/diamond.png')
    this.spriteScale = 12

    this.speed = 4
    this.damage = 15

  }

}
