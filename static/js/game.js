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
      this.bodies[i].draw();
    }
  }
}

var Player = function(game) {
  this.KEYS = { UP: 87, DOWN: 83, LEFT: 65, RIGHT: 68, SPACE: 32 };
  this.DIRECTIONS = { RIGHT: 1, LEFT: -1 };

  this.game = game;

  this.size = {
    x: 40,
    y: 80
  }

  this.center = {
    x: 100,
    y: this.game.gameSize.y / 2
  }
  this.direction = this.DIRECTIONS.RIGHT;

  this.speed = 5;

  this.fist = null;

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
}

Player.prototype = {

  startAttack: function() {
    this.fist = new Fist(this);
    attackSound();
  },

  destroyChild: function(name) {
    this[name] = null;
  },

  update: function() {
    if (this.isDown(this.KEYS.LEFT)) {
      this.center.x -= this.speed;
      this.direction = this.DIRECTIONS.LEFT;
    }
    if (this.isDown(this.KEYS.RIGHT)) {
      this.center.x += this.speed;
      this.direction = this.DIRECTIONS.RIGHT;
    }
    if (this.isDown(this.KEYS.UP)) this.center.y -= this.speed;
    if (this.isDown(this.KEYS.DOWN)) this.center.y += this.speed;

    if (this.isDown(this.KEYS.SPACE)) {
      if (this.fist === null) {
        this.startAttack();
      }
    }
    if (this.fist) {
      this.fist.update();
    }

    if (this.center.x < this.size.x / 2) this.center.x = this.size.x / 2;
    else if (this.center.x > this.game.gameSize.x - this.size.x / 2) this.center.x = this.game.gameSize.x - this.size.x / 2;
    if (this.center.y < this.size.y / 2) this.center.y = this.size.y / 2;
    else if (this.center.y > this.game.gameSize.y - this.size.y / 2) this.center.y = this.game.gameSize.y - this.size.y / 2;
  },

  draw: function() {
    drawRect(this.game.screen, this);

    if (this.fist) {
      this.fist.draw(this.game.screen);
    }
  }
}

var Fist = function(entity) {
  this.entity = entity;

  this.size = {
    x: 30,
    y: 30
  }

  this.speed = 10;

  this.offset = {
    x: 0,
    y: 0,
  }

  this.center = {
    x: this.entity.center.x,
    y: this.entity.center.y,
  }
  this.direction = this.entity.direction;

  this.frame = 0;
}

Fist.prototype = {
  destroy: function() {
    this.entity.destroyChild('fist');
  },

  update: function() {
    if (this.frame === 5) this.direction *= -1;

    if (this.frame < 10) {
      this.offset.x += this.direction * this.speed;

      this.center.x = this.entity.center.x + this.offset.x;
      this.center.y = this.entity.center.y + this.offset.y;

    } else {
      this.center.x = this.entity.center.x;
      this.center.y = this.entity.center.y;
    }

    if (this.frame > 25) {
      this.destroy();
    }

    this.frame++;
  },

  draw: function(screen) {
    drawRect(screen, this);
  }
}

var Enemy = function(game, type, center) {
  this.game = game;

  this.size = {
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

  },

  draw: function() {
    drawRect(this.game.screen, this);
  }
}

var drawRect = function(screen, body) {
  screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
                  body.size.x, body.size.y);
};

new Game();
