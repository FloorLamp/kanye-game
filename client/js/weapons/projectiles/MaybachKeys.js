import Projectile from './Projectile'

export default class MaybachKeys extends Projectile {

  constructor(game, source, destination) {
    super(game, source, destination)

    this.speed = 6
    this.damage = 10
    this.sprite = '../../../img/maybachkey.png'
  }

}
