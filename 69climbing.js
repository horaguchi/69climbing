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
  this.positionX = 0;
  this.positionY = 0;
  this.stamina = 1;
  this.staminaMax = 1;
  this.stageMax = 0;
  this.updateScreen(this.positionX, this.positionY);
};
// for node.js, not for CommonJS
module.exports = SixtyNineClimbing;

var SixtyNineClimbing_X_DIFFICULTY = 10;    // less is harder
var SixtyNineClimbing_Y_DIFFICULTY = 5;     // less is harder
var SixtyNineClimbing_ADD_DIFFICULTY = 300; // less is harder

var SixtyNineClimbing_PLAYER_X = 27;    // less is harder
var SixtyNineClimbing_PLAYER_Y = 30;     // less is harder

// . : - = + * # $
// perl -le '$i = 255; for (0 .. 7) { print sprintf("%02x", $_ * 24); }' | tac
SixtyNineClimbing.getStrFromValue = function (value, rock, easy) {
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
  } else if (easy) {
    if (value > 0.75)         { return '{#ff00ff-fg}.{/#ff00ff-fg}';
    } else if (value > 0.5)   { return '{#ff00ff-fg}:{/#ff00ff-fg}';
    } else if (value > 0.25)  { return '{#ff00ff-fg}-{/#ff00ff-fg}';
    } else if (value > 0)     { return '{#ff00ff-fg}={/#ff00ff-fg}';
    } else if (value > -0.25) { return '{#ff00ff-fg}+{/#ff00ff-fg}';
    } else if (value > -0.5)  { return '{#ff00ff-fg}*{/#ff00ff-fg}';
    } else if (value > -0.75) { return '{#ff00ff-fg}#{/#ff00ff-fg}';
    } else if (value > -1)    { return '{#ff00ff-fg}${/#ff00ff-fg}';
    } else { return '?'; }
  } else {
    if (value > 0.75)         { return '{#000000-fg}.{/#000000-fg}';
    } else if (value > 0.5)   { return '{#000000-fg}:{/#000000-fg}';
    } else if (value > 0.25)  { return '{#000000-fg}-{/#000000-fg}';
    } else if (value > 0)     { return '{#000000-fg}={/#000000-fg}';
    } else if (value > -0.25) { return '{#000000-fg}+{/#000000-fg}';
    } else if (value > -0.5)  { return '{#000000-fg}*{/#000000-fg}';
    } else if (value > -0.75) { return '{#000000-fg}#{/#000000-fg}';
    } else if (value > -1)    { return '{#000000-fg}${/#000000-fg}';
    } else { return '?'; }
  }
};

SixtyNineClimbing.getDepthFromValue = function (value, rock) {
  if (!rock) {
    if (value > 0.75)         { return 0;
    } else if (value > 0.5)   { return 0;
    } else if (value > 0.25)  { return 0;
    } else if (value > 0)     { return 0;
    } else if (value > -0.25) { return 0;
    } else if (value > -0.5)  { return 0;
    } else if (value > -0.75) { return 0;
    } else if (value > -1)    { return 0;
    } else { return 999; }
  } else {
    if (value > 0.75)         { return 8;
    } else if (value > 0.5)   { return 7;
    } else if (value > 0.25)  { return 6;
    } else if (value > 0)     { return 5;
    } else if (value > -0.25) { return 4;
    } else if (value > -0.5)  { return 3;
    } else if (value > -0.75) { return 2;
    } else if (value > -1)    { return 1;
    } else { return 999; }
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
  var getDepthFromValue = SixtyNineClimbing.getDepthFromValue;
  for (var y = 0; y < 47; ++y) {
    // current line
    var current_rock = SixtyNineClimbing.isRockFromY(y + py);
    var current_plus = Math.abs(y + py) / SixtyNineClimbing_ADD_DIFFICULTY;
    // 1 line down
    var base_rock = SixtyNineClimbing.isRockFromY(y + py + 1);
    var base_plus = Math.abs(y + py + 1) / SixtyNineClimbing_ADD_DIFFICULTY;

    for (var x = 0; x < 54; ++x) {
      if (x === SixtyNineClimbing_PLAYER_X && y === SixtyNineClimbing_PLAYER_Y) {
        screen[y][x] = '{#ff0000-fg}@{/#ff0000-fg}';
      } else if ((y + py) > 35) {
        screen[y][x] = ' ';
      } else {
        var current_noise = noise.simplex2((x + px) / (SixtyNineClimbing_X_DIFFICULTY + current_plus * 2), (y + py) / (SixtyNineClimbing_Y_DIFFICULTY + current_plus));
        var current_depth = getDepthFromValue(current_noise, current_rock);
        var base_noise    = noise.simplex2((x + px) / (SixtyNineClimbing_X_DIFFICULTY + base_plus * 2), (y + py + 1) / (SixtyNineClimbing_Y_DIFFICULTY + base_plus));
        var base_depth = getDepthFromValue(base_noise, base_rock);
        screen[y][x] = getStrFromValue(current_noise, current_rock, (base_depth === 0 || base_depth < current_depth));
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
  return [ (stamina_str + "       STAGE: " + this.stageMax).split("") ].concat(this.screen);
};

SixtyNineClimbing.prototype.canMoveEasy = function (px, py) {
  var noise = perlin.noise;
  var next_x = px + SixtyNineClimbing_PLAYER_X, next_y = py + SixtyNineClimbing_PLAYER_Y;
  var base_x = next_x, base_y = next_y + 1;

  var next_plus = Math.abs(next_y) / SixtyNineClimbing_ADD_DIFFICULTY;
  var next_noise_value = noise.simplex2(next_x / (SixtyNineClimbing_X_DIFFICULTY + next_plus * 2), next_y / (SixtyNineClimbing_Y_DIFFICULTY + next_plus));
  var next_depth = SixtyNineClimbing.getDepthFromValue(next_noise_value, SixtyNineClimbing.isRockFromY(next_y));

  var base_plus = Math.abs(base_y) / SixtyNineClimbing_ADD_DIFFICULTY;
  var base_noise_value = noise.simplex2(base_x / (SixtyNineClimbing_X_DIFFICULTY + base_plus * 2), base_y / (SixtyNineClimbing_Y_DIFFICULTY + base_plus));
  var base_depth = SixtyNineClimbing.getDepthFromValue(base_noise_value, SixtyNineClimbing.isRockFromY(base_y));
  return next_depth === 0 || base_depth < next_depth;
};

SixtyNineClimbing.prototype.point = function (x, y) {
  var sx = x - SixtyNineClimbing_PLAYER_X, sy = y - SixtyNineClimbing_PLAYER_Y;
  var x_y = Math.abs(sx) - Math.abs(sy);
  if (x_y === 0) {
    return false;
  } else if (x_y < 0) {
    if (sy < 0) {
      if (this.canMoveEasy(this.positionX, this.positionY - 1)) {
        --this.positionY;
        this.stageMax = Math.max(SixtyNineClimbing.isRockFromY(this.positionY + SixtyNineClimbing_PLAYER_Y), this.stageMax);
        this.staminaMax = Math.max(Math.ceil(this.stageMax / 2), this.staminaMax);
        this.stamina = this.staminaMax;
      } else if (0 < this.stamina) {
        --this.stamina;
        --this.positionY;
      } else {
        if (this.canMoveEasy(this.positionX, this.positionY + 1)) {
          this.stamina = this.staminaMax;
        }
        ++this.positionY; // if stamina is zero, you fall
      }
    } else if (sy > 0) {
      if (this.canMoveEasy(this.positionX, this.positionY + 1)) {
        ++this.positionY;
        this.stamina = this.staminaMax;
      } else if (0 < this.stamina) {
        --this.stamina;
        ++this.positionY;
      } else {
        if (this.canMoveEasy(this.positionX, this.positionY + 1)) {
          this.stamina = this.staminaMax;
        }
        ++this.positionY; // if stamina is zero, you fall
      }
    }
  } else if (x_y > 0) {
    if (sx < 0) {
      if (this.canMoveEasy(this.positionX - 1, this.positionY)) {
        --this.positionX;
        this.stamina = this.staminaMax;
      } else if (0 < this.stamina) {
        --this.stamina;
        --this.positionX;
      } else {
        if (this.canMoveEasy(this.positionX, this.positionY + 1)) {
          this.stamina = this.staminaMax;
        }
        ++this.positionY; // if stamina is zero, you fall
      }
    } else if (sx > 0) {
      if (this.canMoveEasy(this.positionX + 1, this.positionY)) {
        ++this.positionX;
        this.stamina = this.staminaMax;
      } else if (0 < this.stamina) {
        --this.stamina;
        ++this.positionX;
      } else {
        //if (this.canMoveEasy(this.positionX, this.positionY + 1)) { // already checked
        //  this.stamina = this.staminaMax;
        //}
        ++this.positionY; // if stamina is zero, you fall
      }
    }
  }
  this.updateScreen(this.positionX, this.positionY);
  return true;
};
