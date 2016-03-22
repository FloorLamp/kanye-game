var SOUNDS = {
  titleScreen: "./static/sounds/titlescreen.mp3",
  startGame: "./static/sounds/startgame.mp3",
}

var playSound = function(sound, self) {
  if (sound === 'attack') {
    var attacks = ['./static/sounds/hangh1.mp3', './static/sounds/hangh2.mp3', './static/sounds/hangh3.mp3'];
    var playSound = attacks[Math.floor(Math.random() * attacks.length)];
  } else {
    playSound = SOUNDS[sound]
  }

  var toPlaySound = new Audio(playSound);
  toPlaySound.play();
}

var Song = function(game, song) {
  var self = this;

  this.game = game;
  this.playing = true;
  this.curSong = new Audio(SOUNDS[song]);
  this.loop = true;

  this.curSong.addEventListener('ended', function() {
    this.currentTime = 0;
    if (self.loop && self.playing) {
      this.play();
    }
  }, false)

  if (this.playing) {
    this.curSong.play()
  };

}

Song.prototype = {
  updateSong: function(song) {
    this.curSong = new Audio(song)
  },

  stopSong: function() {
    this.curSong.pause();
  },
}
