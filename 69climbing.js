var perlin = require('./perlin');
perlin.noise.seed(Math.random());

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
};
// for node.js, not for CommonJS
module.exports = SixtyNineClimbing;

SixtyNineClimbing.prototype.createScreen = function () {
  var i = this.i++;
  var screen = this.screen;
  for (var y = 0; y < 48; ++y) {
    for (var x = 0; x < 54; ++x) {
      screen[y][x] = String(i % 10);
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
