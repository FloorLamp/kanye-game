var Game = function() {
  var canvas = document.getElementById('canvas');
  this.screen = canvas.getContext('2d');
  this.gameSize = { x: canvas.width, y: canvas.height };

  this.bodies = [];

  this.bodies.push(new Player(this));

  var self = this;

  function tick() {
    self.update();
    self.draw();

    requestAnimationFrame(tick);
  }
  tick();
}

Game.prototype = {
  update: function() {
    for (var i = 0; i < this.bodies.length; i++) {
      this.bodies[i].update();
    }
  },

  draw: function() {
    this.screen.clearRect(0, 0, this.gameSize.x, this.gameSize.y);

    for (var i = 0; i < this.bodies.length; i++) {
      drawRect(this.screen, this.bodies[i]);
    }
  }
}

var Player = function(game) {
  this.game = game;

  this.size = {
    x: 40,
    y: 80
  }

  this.center = {
    x: 100,
    y: this.game.gameSize.y / 2
  }

  this.speed = 5;

  var keyState = {};

  window.addEventListener('keydown', function(e) {
    keyState[e.keyCode] = true;
  });

  window.addEventListener('keyup', function(e) {
    keyState[e.keyCode] = false;
  });

  this.isDown = function(keyCode) {
    return keyState[keyCode] === true;
  };

  this.KEYS = { UP: 87, DOWN: 83, LEFT: 65, RIGHT: 68, SPACE: 32 };
}

Player.prototype = {
  update: function() {
    if (this.isDown(this.KEYS.LEFT)) this.center.x -= this.speed;
    if (this.isDown(this.KEYS.RIGHT)) this.center.x += this.speed;
    if (this.isDown(this.KEYS.UP)) this.center.y -= this.speed;
    if (this.isDown(this.KEYS.DOWN)) this.center.y += this.speed;

    if (this.isDown(this.KEYS.SPACE)) this.game.bodies.push(new Enemy(this.game))

    if (this.center.x < this.size.x / 2) this.center.x = this.size.x / 2;
    else if (this.center.x > this.game.gameSize.x - this.size.x / 2) this.center.x = this.game.gameSize.x - this.size.x / 2;
    if (this.center.y < this.size.y / 2) this.center.y = this.size.y / 2;
    else if (this.center.y > this.game.gameSize.y - this.size.y / 2) this.center.y = this.game.gameSize.y - this.size.y / 2;
  }
}

var Enemy = function(game, type, center) {
  this.game = game;

  this.size =  {
    x: 40,
    y: 80
  }

  // spawn randomly
  if (!center) {
    center = {
      x: game.gameSize.x,
      y: Math.random() * game.gameSize.y
    }
  }
  this.center = center;

  // default speed
  this.speed = 4;
  this.vector = null;

  this.TYPES = {
    '2CHAINZ': 0,
  }

  if (type === this.TYPES['2CHAINZ']) {
    this.speed = 3;
  }

}

Enemy.prototype = {
  update: function() {
    this.action();
    this.move();
  },

  action: function() {
    // body...
  },

  move: function() {
    // randomly pick a vector
    if (!this.vector) {
      this.vector = {
        x: (Math.random() - 1) * this.speed,
        y: (Math.random() - 1) * this.speed,
      }
    }

    this.center.x += this.vector.x;
    this.center.y += this.vector.y;

    // bounce off walls
    if (this.center.x < this.size.x / 2) {
      this.center.x = this.size.x / 2;
      this.vector.x *= -1;
    } else if (this.center.x > this.game.gameSize.x - this.size.x / 2) {
      this.center.x = this.game.gameSize.x - this.size.x / 2;
      this.vector.x *= -1;
    }

    if (this.center.y < this.size.y / 2) {
      this.center.y = this.size.y / 2;
      this.vector.y *= -1;
    } else if (this.center.y > this.game.gameSize.y - this.size.y / 2) {
      this.center.y = this.game.gameSize.y - this.size.y / 2;
      this.vector.y *= -1;
    }

  }
}

var drawRect = function(screen, body) {
  screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
                  body.size.x, body.size.y);
};

new Game();
