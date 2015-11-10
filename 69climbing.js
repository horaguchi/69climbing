var perlin = require('./perlin');

var SixtyNineClimbing = function () {
  perlin.noise.seed(Math.random());

  var screen = this.screen = [];
  for (var y = 0; y < 48; ++y) {
    var row = [];
    for (var x = 0; x < 54; ++x) {
      row.push('.');
    }
    screen.push(row);
  }
  this.playerX = 100;
  this.playerY = 100;
  this.updateScreen(this.playerX, this.playerY);
};
// for node.js, not for CommonJS
module.exports = SixtyNineClimbing;

// . : - = + * # $
// perl -le '$i = 255; for (0 .. 7) { print sprintf("%x", $i - $_ * 22); }'
SixtyNineClimbing.getStrFromValue = function (value, player) {
  if (player) {
    if (value > 0.75)         { return '{#ff0000-fg}@{/#ff0000-fg}';
    } else if (value > 0.5)   { return '{#ff0000-fg}@{/#ff0000-fg}';
    } else if (value > 0.25)  { return '{#ff0000-fg}@{/#ff0000-fg}';
    } else if (value > 0)     { return '{#ff0000-fg}@{/#ff0000-fg}';
    } else if (value > -0.25) { return '{#ff0000-fg}@{/#ff0000-fg}';
    } else if (value > -0.5)  { return '{#ff0000-fg}@{/#ff0000-fg}';
    } else if (value > -0.75) { return '{#ff0000-fg}@{/#ff0000-fg}';
    } else if (value > -1)    { return '{#ff0000-fg}@{/#ff0000-fg}';
    } else { return '?'; }
  } else {
    if (value > 0.75)         { return '{#8c8c8c-fg}.{/#8c8c8c-fg}';
    } else if (value > 0.5)   { return '{#787878-fg}:{/#787878-fg}';
    } else if (value > 0.25)  { return '{#646464-fg}-{/#646464-fg}';
    } else if (value > 0)     { return '{#505050-fg}={/#505050-fg}';
    } else if (value > -0.25) { return '{#3c3c3c-fg}+{/#3c3c3c-fg}';
    } else if (value > -0.5)  { return '{#282828-fg}*{/#282828-fg}';
    } else if (value > -0.75) { return '{#141414-fg}#{/#141414-fg}';
    } else if (value > -1)    { return '{#000000-fg}${/#000000-fg}';
    } else { return '?'; }
  }
};

SixtyNineClimbing.prototype.updateScreen = function (px, py) {
  var screen = this.screen;
  var noise = perlin.noise;
  var getStrFromValue = SixtyNineClimbing.getStrFromValue;
  for (var y = 0; y < 48; ++y) {
    for (var x = 0; x < 54; ++x) {
      screen[y][x] = getStrFromValue(noise.simplex2((x + px) / 16, (y + py) / 8), (x === 27 && y === 30));
    }
  }
};

SixtyNineClimbing.prototype.getScreen = function () {
  return this.screen;
};

SixtyNineClimbing.prototype.point = function (x, y) {
  var sx = x - 27, sy = y - 30;
  var x_y = Math.abs(sx) - Math.abs(sy);
  if (x_y === 0) {
    return false;
  } else if (x_y < 0) {
    if (sy < 0) {
      --this.playerY;
    } else if (sy > 0) {
      ++this.playerY;
    }
  } else if (x_y > 0) {
    if (sx < 0) {
      --this.playerX;
    } else if (sx > 0) {
      ++this.playerX;
    }
  }
  this.updateScreen(this.playerX, this.playerY);
  return true;
};
