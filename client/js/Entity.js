
export default class Entity {

  constructor(game) {
    if (new.target === Entity) throw new TypeError()
    if (typeof this.update !== 'function') throw new TypeError(`${new.target}: update() not implemented`)
    if (typeof this.draw !== 'function') throw new TypeError(`${new.target}: draw() not implemented`)
    if (typeof this.destroy !== 'function') throw new TypeError(`${new.target}: destroy() not implemented`)

    this.game = game
  }

}

