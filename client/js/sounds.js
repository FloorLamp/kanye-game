const SOUNDS = {
  titleScreen: require('../sounds/intro.mp3'),
  startGame: require('../sounds/startgame.mp3'),
  gameOver: require('../sounds/gameover-final.mp3'),
  gameEnd: require('../sounds/gameend-final.mp3'),
  endoflevel: [
    require('../sounds/endoflevel1.mp3'),
    require('../sounds/endoflevel2.mp3'),
  ],
  kanyeFistAttack: [
    require('../sounds/hangh1.mp3'),
    require('../sounds/hangh2.mp3'),
    require('../sounds/hangh3.mp3')
  ],
  twochainzAttack: [
    require('../sounds/2chainz1.mp3'),
    require('../sounds/2chainz2.mp3'),
    require('../sounds/2chainzgetem.mp3')
  ],
  bigseanAttack: [
    require('../sounds/swerve.mp3'),
  ],
  chiefkeefAttack: [
    require('../sounds/bangbang.mp3'),
  ],
  jayzAttack: [
    require('../sounds/ballsohard.mp3'),
  ],
  wavesAttack: [
    require('../sounds/wavesdontdie.mp3'),
  ],
  ultralight_beam: require('../sounds/ultralightbeam.mp3'),
  rihanna_ellaella: require('../sounds/rihanna_ellaella.mp3'),
  rihanna_stand: require('../sounds/rihanna_stand.mp3'),
  maybachKeys: require('../sounds/maybachkeys.mp3'),
  sunglasses: require('../sounds/sunglassesadvil.mp3'),
  diamonds: require('../sounds/diamonds.mp3'),
  blackballs: require('../sounds/myblackballs.mp3'),
}

export function playSound(sound, self) {
  let soundFile = SOUNDS[sound]
  let toPlay = soundFile
  if (Array.isArray(soundFile)) {
    toPlay = _.sample(soundFile)
  }

  let toPlaySound = new Audio(toPlay)
  toPlaySound.play()
  return toPlaySound
}

export class Song {
  constructor(game, song) {
    this.game = game
    this.playSong = true
    this.curSong = new Audio(SOUNDS[song])
    this.loop = true

    this.curSong.addEventListener('ended', () => {
      this.currentTime = 0
      if (this.loop && this.playSong) {
        this.curSong.play()
      }
    }, false)

    if (this.playSong) {
      this.curSong.play()
    }

  }

  updateSong(song) {
    this.curSong = new Audio(SOUNDS[song])
    this.curSong.play()
  }

  stopSong() {
    this.curSong.pause()
  }
}
