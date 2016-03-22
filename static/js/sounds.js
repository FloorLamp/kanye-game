function attackSound(self) {
    var attacks = ['./static/sounds/hangh1.mp3', './static/sounds/hangh2.mp3', './static/sounds/hangh3.mp3'];
    var curAttack = attacks[Math.floor(Math.random() * attacks.length)];

    var playAttack = new Audio(curAttack);

    playAttack.play();
}
