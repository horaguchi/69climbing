var perlin = require('./perlin');

var SixtyNineClimbing = function () {
  this.i = 0;
  var screen = this.screen = [];
  for (var y = 0; y < 48; ++y) {
    var row = [];
    for (var x = 0; x < 54; ++x) {
      row.push('.');
    }
    screen.push(row);
  }
  this.createScreen();
};
// for node.js, not for CommonJS
module.exports = SixtyNineClimbing;

SixtyNineClimbing.getStrFromValue = function (value) {
  if (value > 0.9) {
    return '9';
  } else if (value > 0.8) {
    return '8';
  } else if (value > 0.7) {
    return '7';
  } else if (value > 0.6) {
    return '6';
  } else if (value > 0.5) {
    return '5';
  } else if (value > 0.4) {
    return '4';
  } else if (value > 0.3) {
    return '3';
  } else if (value > 0.2) {
    return '2';
  } else if (value > 0.1) {
    return '1';
  } else if (value > 0) {
    return '0';
  } else if (value > -0.1) {
    return 'a';
  } else if (value > -0.2) {
    return 'b';
  } else if (value > -0.3) {
    return 'c';
  } else if (value > -0.4) {
    return 'd';
  } else if (value > -0.5) {
    return 'e';
  } else if (value > -0.6) {
    return 'f';
  } else if (value > -0.7) {
    return 'g';
  } else if (value > -0.8) {
    return 'h';
  } else if (value > -0.9) {
    return 'i';
  } else if (value > -1) {
    return 'j';
  } else {
    return '?';
  }
};

SixtyNineClimbing.prototype.createScreen = function () {
  var screen = this.screen;
  var noise = perlin.noise;
  noise.seed(this.i++);

  var getStrFromValue = SixtyNineClimbing.getStrFromValue;
  for (var y = 0; y < 48; ++y) {
    for (var x = 0; x < 54; ++x) {
      screen[y][x] = getStrFromValue(noise.simplex2(x / 10, y / 10));
    }
  }
};

SixtyNineClimbing.prototype.getScreen = function () {
  return this.screen;
};

SixtyNineClimbing.prototype.point = function () {
  this.createScreen();
  return true;
};
