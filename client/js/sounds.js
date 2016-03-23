const SOUNDS = {
  titleScreen: require('../sounds/titlescreen.mp3'),
  startGame: require('../sounds/startgame.mp3'),
}

export function playSound(sound, self) {
  if (sound === 'attack') {
    var attacks = [
      require('../sounds/hangh1.mp3'),
      require('../sounds/hangh2.mp3'),
      require('../sounds/hangh3.mp3')
    ];
    var playSound = attacks[Math.floor(Math.random() * attacks.length)];
  } else {
    playSound = SOUNDS[sound]
  }

  var toPlaySound = new Audio(playSound);
  toPlaySound.play();
}

export class Song {
  constructor(game, song) {
    this.game = game;
    this.playing = true;
    this.curSong = new Audio(SOUNDS[song]);
    this.loop = true;

    this.curSong.addEventListener('ended', function() { // need context
      this.currentTime = 0;
      if (this.loop && this.playing) {
        this.play();
      }
    }, false)

    if (this.playing) {
      this.curSong.play()
    };

  }

  updateSong(song) {
    this.curSong = new Audio(song)
  }

  stopSong() {
    this.curSong.pause();
  }
}
