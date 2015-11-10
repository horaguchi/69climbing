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
  this.createScreen(this.playerX, this.playerY);
};
// for node.js, not for CommonJS
module.exports = SixtyNineClimbing;

// . : - = + * # $
// perl -le '$i = 255; for (0 .. 7) { print sprintf("%x", $i - $_ * 22); }'
SixtyNineClimbing.getStrFromValue = function (value) {
  if (value > 0.75)         { return '{#656565-fg}.{/#656565-fg}';
  } else if (value > 0.5)   { return '{#7b7b7b-fg}:{/#7b7b7b-fg}';
  } else if (value > 0.25)  { return '{#919191-fg}-{/#919191-fg}';
  } else if (value > 0)     { return '{#a7a7a7-fg}={/#a7a7a7-fg}';
  } else if (value > -0.25) { return '{#bdbdbd-fg}+{/#bdbdbd-fg}';
  } else if (value > -0.5)  { return '{#d3d3d3-fg}*{/#d3d3d3-fg}';
  } else if (value > -0.75) { return '{#e9e9e9-fg}#{/#e9e9e9-fg}';
  } else if (value > -1)    { return '{#ffffff-fg}${/#ffffff-fg}';
  } else { return '?'; }
};

SixtyNineClimbing.prototype.createScreen = function (px, py) {
  var screen = this.screen;
  var noise = perlin.noise;
  var getStrFromValue = SixtyNineClimbing.getStrFromValue;
  for (var y = 0; y < 48; ++y) {
    for (var x = 0; x < 54; ++x) {
      screen[y][x] = getStrFromValue(noise.simplex2((x + px) / 20, (y + py) / 10));
    }
  }
};

SixtyNineClimbing.prototype.getScreen = function () {
  return this.screen;
};

SixtyNineClimbing.prototype.point = function (x, y) {
  this.playerX += (x < 27 ? -1 : 1);
  this.playerY += (y < 24 ? -1 : 1);
  this.createScreen(this.playerX, this.playerY);
  return true;
};
