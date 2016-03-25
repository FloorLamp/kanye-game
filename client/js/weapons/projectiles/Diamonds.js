import Projectile from './Projectile'

export default class Diamonds extends Projectile {

  constructor(game, source, destination, opts) {
    super(game, source, destination, opts)

    this.speed = 5
    this.damage = 15
  }

}
