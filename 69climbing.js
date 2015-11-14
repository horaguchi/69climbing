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
  this.playerX = 0;
  this.playerY = 0;
  this.stamina = 1;
  this.staminaMax = 1;
  this.updateScreen(this.playerX, this.playerY);
};
// for node.js, not for CommonJS
module.exports = SixtyNineClimbing;

// . : - = + * # $
// perl -le '$i = 255; for (0 .. 7) { print sprintf("%x", $i - $_ * 22); }'
SixtyNineClimbing.getStrFromValue = function (value, rock) {
  if (!rock) {
    if (value > 0.75)         { return '{#00ff00-fg}"{/#00ff00-fg}';
    } else if (value > 0.5)   { return '{#aaaaaa-fg}.{/#aaaaaa-fg}';
    } else if (value > 0.25)  { return '{#aaaaaa-fg}.{/#aaaaaa-fg}';
    } else if (value > 0)     { return '{#aaaaaa-fg}.{/#aaaaaa-fg}';
    } else if (value > -0.25) { return '{#aaaaaa-fg}.{/#aaaaaa-fg}';
    } else if (value > -0.5)  { return '{#aaaaaa-fg}.{/#aaaaaa-fg}';
    } else if (value > -0.75) { return '{#aaaaaa-fg}.{/#aaaaaa-fg}';
    } else if (value > -1)    { return '{#aaffaa-fg}"{/#aaffaa-fg}';
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
SixtyNineClimbing.LEVEL = [
  [    0, 0 ],
  [   10, 1 ], //    6
  [   16, 0 ],
  [   66, 2 ], //   10
  [   76, 0 ],
  [  125, 3 ], //   25
  [  150, 0 ],
  [  200, 4 ], //   50
  [  250, 0 ],
  [  300, 5 ], //   75
  [  375, 0 ],
  [  425, 6 ], //  100
  [  525, 0 ],
  [  575, 7 ], //  200
  [  775, 0 ],
  [  850, 8 ], //  500
  [ 1350, 0 ],
  [ 1400, 9 ], // 1000
  [ 2400, 0 ]
];
SixtyNineClimbing.isRockFromY_cache = {};
SixtyNineClimbing.isRockFromY = function (y) {
  if (y > 0) {
    return 0;
  }
  var abs_y = Math.abs(y);
  var cache = SixtyNineClimbing.isRockFromY_cache;
  if (cache.hasOwnProperty(abs_y)) {
    return cache[abs_y];
  }
  var level = SixtyNineClimbing.LEVEL;
  var result = 0;
  for (var i = 0, l = level.length; i < l; ++i) {
    var value = level[i];
    if (value[0] <= abs_y) {
      result = value[1];
    } else {
      break;
    }
  }
  cache[abs_y] = result;
  return result;
};

SixtyNineClimbing.prototype.updateScreen = function (px, py) {
  var screen = this.screen;
  var noise = perlin.noise;
  var getStrFromValue = SixtyNineClimbing.getStrFromValue;
  for (var y = 0; y < 47; ++y) {
    var is_rock = SixtyNineClimbing.isRockFromY(y + py);
    for (var x = 0; x < 54; ++x) {
      if (x === 27 && y === 30) {
        screen[y][x] = '{#ff0000-fg}@{/#ff0000-fg}';
      } else if ((y + py) > 35) {
        screen[y][x] = ' ';
      } else {
        screen[y][x] = getStrFromValue(noise.simplex2((x + px) / 20, (y + py) / 10), is_rock);
      }
    }
  }
};

SixtyNineClimbing.prototype.getScreen = function () {
  var stamina_str = "STAMINA: ";
  var stamina = this.stamina;
  var stamina_max = this.staminaMax;
  for (var i = 0; i < 10; ++i) {
    if (i < stamina) {
      stamina_str += "[*]";
    } else if (i < stamina_max) {
      stamina_str += "[ ]";
    } else {
      stamina_str += "   ";
    }
  }
  return [ stamina_str.split("")  ].concat(this.screen);
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
