const SOUNDS = {
  titleScreen: require('../sounds/titlescreen.mp3'),
  startGame: require('../sounds/startgame.mp3'),
  attack: [
    require('../sounds/hangh1.mp3'),
    require('../sounds/hangh2.mp3'),
    require('../sounds/hangh3.mp3')
  ]
}

export function playSound(sound, self) {
  var soundFile = SOUNDS[sound];
  if (sound === 'attack') {
    toPlay = soundFile[Math.floor(Math.random() * soundFile.length)];
  }

  var toPlaySound = new Audio(soundFile);
  toPlaySound.play();
}

export class Song {
  constructor(game, song) {
    this.game = game;
    this.playing = true;
    this.curSong = new Audio(SOUNDS[song]);
    this.loop = true;

    var self = this;

    this.curSong.addEventListener('ended', function() { // need context
      this.currentTime = 0;
      if (self.loop && self.playing) {
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
