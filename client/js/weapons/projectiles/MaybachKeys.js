import Projectile from './Projectile'

export default class MaybachKeys extends Projectile {

  constructor(game, source, destination) {
    super(game, source, destination)

    this.sprite = require('../../../img/maybachkey.png')
    this.spriteScale = 6

    this.speed = 6
    this.damage = 10
  }

}
