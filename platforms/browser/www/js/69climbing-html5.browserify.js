(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SixtyNineClimbing = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var SixtyNineClimbing = require('./69climbing');

// for node.js, not for CommonJS
module.exports = SixtyNineClimbing;

SixtyNineClimbing.prototype.initialCanvas = function (element) {
  this.canvasElement = document.createElement('canvas');
  element.appendChild(this.canvasElement);
  this.resizeCanvas();

  SixtyNineClimbing.ins = this;
  var game = this;
  var lastPoint = game.lastPoint = [];
  this.canvasElement.addEventListener('touchstart', function (e) {
    e.preventDefault();
    var rect = e.target.getBoundingClientRect();
    var point = game.getPointFromHTML(e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top);
    lastPoint[0] = point[0];
    lastPoint[1] = point[1];
    game.touchNow = point;
    game.active = true;
    game.startAnimation();
  });

  this.canvasElement.addEventListener('touchmove', function (e) {
    e.preventDefault();
    var rect = e.target.getBoundingClientRect();
    var point = game.getPointFromHTML(e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top);
    if (game.touchNow[0] === point[0] && game.touchNow[1] === point[1]) {
      // nothing
    } else {
      lastPoint[0] = point[0];
      lastPoint[1] = point[1];
    }
    game.touchNow = point;
  });

  this.canvasElement.addEventListener('touchend', function (e) {
    e.preventDefault();
    var rect = e.target.getBoundingClientRect();
    var point = game.getPointFromHTML(e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top);
    lastPoint[0] = point[0];
    lastPoint[1] = point[1];
    game.touchNow = point;
    game.active = false;
  });

  this.canvasElement.addEventListener('mousedown', function (e) {
    e.preventDefault();
    var rect = e.target.getBoundingClientRect();
    var point = game.getPointFromHTML(e.clientX - rect.left, e.clientY - rect.top);
    lastPoint[0] = point[0];
    lastPoint[1] = point[1];
    game.active = true;
    game.startAnimation();
  });

  this.canvasElement.addEventListener('mousemove', function (e) {
    e.preventDefault();
    var rect = e.target.getBoundingClientRect();
    var point = game.getPointFromHTML(e.clientX - rect.left, e.clientY - rect.top);
    lastPoint[0] = point[0];
    lastPoint[1] = point[1];
  });

  this.canvasElement.addEventListener('mouseup', function (e) {
    e.preventDefault();
    var rect = e.target.getBoundingClientRect();
    var point = game.getPointFromHTML(e.clientX - rect.left, e.clientY - rect.top);
    lastPoint[0] = point[0];
    lastPoint[1] = point[1];
    game.active = false;
  });

  this.canvasElement.addEventListener('mouseleave', function (e) {
    e.preventDefault();
    game.active = false;
  });

  window.addEventListener("keypress", function (e) {
    e.preventDefault();
    var key = String.fromCharCode(e.keyCode);
    // @ is (27, 30)
    var x = 27, y = 30;
    if (key === "w" || key === "k") {
      y = 29;
    } else if (key === "a" || key === "h") {
      x = 26;
    } else if (key === "s" || key === "j") {
      y = 31;
    } else if (key === "d" || key === "l") {
      x = 28;
    }
    if (game.point(x, y)) {
      game.draw();
    }
  }, false);

  window.addEventListener('resize', function() {
    if (game.resizeTimer) {
      clearTimeout(game.resizeTimer);
    }
    game.resizeTimer = setTimeout(function () {
      game.resizeCanvas();
    }, 100);
  });
};

SixtyNineClimbing.prototype.startAnimation = function () {
  var lastPoint = this.lastPoint;
  var game = this;
  if (game.active && game.point(lastPoint[0], lastPoint[1])) {
    game.draw();
  }
  if (this.animationInterval) {
    window.clearInterval(this.animationInterval);
  }
  this.animationInterval = window.setInterval(function () {
    if (game.active && game.point(lastPoint[0], lastPoint[1])) {
      game.draw();
    }
  }, 300);
};

SixtyNineClimbing.FONT_MAP_SIZE = 50; // font map is for pre-rendering area, 50 x 50 is reserved in the default
SixtyNineClimbing.prototype.resizeCanvas = function () {
  if (this.maxWidth  && this.maxWidth  === window.innerWidth &&
      this.maxHeight && this.maxHeight === window.innerHeight) {
    return; // nothing to do
  }

  var device_pixel_ratio = window.devicePixelRatio || 1;
  this.maxWidth  = window.innerWidth;
  this.maxHeight = window.innerHeight;
  var font_size = Math.min(Math.floor(this.maxWidth * device_pixel_ratio / 54), Math.floor(this.maxHeight * device_pixel_ratio / 48 / 2));
  if (this.fontX === font_size && this.fontY === font_size * 2) {
    return; // nothing to do
  }

  this.fontX = font_size; this.fontY = font_size * 2;
  this.devicePixelRatio = device_pixel_ratio;

  this.canvasElement.setAttribute('width',  this.fontX * 54);
  this.canvasElement.setAttribute('height', this.fontY * 48);
  this.canvasElement.parentElement.style.width  = Math.round(this.fontX * 54 / device_pixel_ratio) + 'px';
  this.canvasElement.parentElement.style.height = Math.round(this.fontY * 48 / device_pixel_ratio) + 'px';
  this.canvasElement.style.width  = Math.round(this.fontX * 54 / device_pixel_ratio) + 'px';
  this.canvasElement.style.height = Math.round(this.fontY * 48 / device_pixel_ratio) + 'px';
  this.canvasContext = this.canvasElement.getContext("2d");
  this.canvasContext.fillStyle = 'white';

  this.fontCanvasElement = document.createElement('canvas');
  this.fontCanvasElement.setAttribute('width',  this.fontX);
  this.fontCanvasElement.setAttribute('height', this.fontY);
  this.fontCanvasContext = this.fontCanvasElement.getContext("2d");
  this.fontCanvasContext.fillStyle = this.fillStyle = 'black';
  this.fontCanvasContext.font = this.fontY + 'px Monospace';
  this.fontCanvasContext.textAlign = 'center';
  this.fontCanvasContext.textBaseline = 'middle';

  this.fontMap = {}; // str + ' ' + color : [ dx, dy ]
  this.fontLength = 0;
  this.fontMapCanvasElement = document.createElement('canvas');
  this.fontMapCanvasElement.setAttribute('width',  this.fontX * SixtyNineClimbing.FONT_MAP_SIZE);
  this.fontMapCanvasElement.setAttribute('height', this.fontY * SixtyNineClimbing.FONT_MAP_SIZE);
  this.fontMapCanvasContext = this.fontMapCanvasElement.getContext("2d");
  this.fontMapCanvasContext.fillStyle = 'white';
  this.fontMapCanvasContext.fillRect(0, 0, this.fontX * SixtyNineClimbing.FONT_MAP_SIZE, this.fontY * SixtyNineClimbing.FONT_MAP_SIZE);

  // for full width
  this.fontFWCanvasElement = document.createElement('canvas');
  this.fontFWCanvasElement.setAttribute('width',  this.fontX * 2);
  this.fontFWCanvasElement.setAttribute('height', this.fontY);
  this.fontFWCanvasContext = this.fontFWCanvasElement.getContext("2d");
  this.fontFWCanvasContext.fillStyle = this.fillStyle = 'black';
  this.fontFWCanvasContext.font = this.fontY + 'px Monospace';
  this.fontFWCanvasContext.textAlign = 'center';
  this.fontFWCanvasContext.textBaseline = 'middle';

  this.fontFWMap = {}; // str + ' ' + color : [ dx, dy ]
  this.fontFWLength = 0;
  this.fontFWMapCanvasElement = document.createElement('canvas');
  this.fontFWMapCanvasElement.setAttribute('width',  this.fontX * SixtyNineClimbing.FONT_MAP_SIZE * 2);
  this.fontFWMapCanvasElement.setAttribute('height', this.fontY * SixtyNineClimbing.FONT_MAP_SIZE);
  this.fontFWMapCanvasContext = this.fontFWMapCanvasElement.getContext("2d");
  this.fontFWMapCanvasContext.fillStyle = 'white';
  this.fontFWMapCanvasContext.fillRect(0, 0, this.fontX * SixtyNineClimbing.FONT_MAP_SIZE * 2, this.fontY * SixtyNineClimbing.FONT_MAP_SIZE);

  // initial drawing
  this.draw(true);
};

SixtyNineClimbing.prototype.getPointFromHTML = function (x, y) {
  var px = x, py = y;
  var mx = Math.floor(px * this.devicePixelRatio / this.fontX), my = Math.floor(py * this.devicePixelRatio / this.fontY);
  return [ mx, my ];
};

SixtyNineClimbing.COLOR_REGEXP = /^\{([^-]+)-fg\}(.*)\{\/\1-fg\}$/;
SixtyNineClimbing.prototype.draw = function (initial) {
  var screen = this.getScreen();
  var context = this.canvasContext;

  // for half width
  var font_element = this.fontCanvasElement;
  var font_context = this.fontCanvasContext;
  var font_map = this.fontMap;
  var font_map_element = this.fontMapCanvasElement;
  var font_map_context = this.fontMapCanvasContext;

  // for full width
  var fontfw_element = this.fontFWCanvasElement;
  var fontfw_context = this.fontFWCanvasContext;
  var fontfw_map = this.fontFWMap;
  var fontfw_map_element = this.fontFWMapCanvasElement;
  var fontfw_map_context = this.fontFWMapCanvasContext;

  var old_screen = initial ? null : this.oldScreen;
  var dw = this.fontX, dh = this.fontY;

  var get_str_pos = function (str, color, full_width) {
    if (font_map[str + ' ' + color]) {
      return font_map[str + ' ' + color];
    }
    var dx, dy, px, py;
    if (full_width) {
      ++this.fontFWLength;
      dx = (this.fontFWLength % SixtyNineClimbing.FONT_MAP_SIZE) * dw * 2; dy = Math.floor(this.fontFWLength / SixtyNineClimbing.FONT_MAP_SIZE) * dh;
      px = dw; py = dh * 0.5;
      fontfw_context.clearRect(0, 0, dw * 2, dh);
      fontfw_context.fillStyle = color;
      fontfw_context.fillText(str, px, py);
      fontfw_map_context.drawImage(fontfw_element, dx, dy);
      fontfw_map[str + ' ' + color] = [ dx, dy ];
      return fontfw_map[str + ' ' + color];
    } else {
      ++this.fontLength;
      dx = (this.fontLength % SixtyNineClimbing.FONT_MAP_SIZE) * dw; dy = Math.floor(this.fontLength / SixtyNineClimbing.FONT_MAP_SIZE) * dh;
      px = dw * 0.5; py = dh * 0.5;
      font_context.clearRect(0, 0, dw, dh);
      font_context.fillStyle = color;
      font_context.fillText(str, px, py);
      font_map_context.drawImage(font_element, dx, dy);
      font_map[str + ' ' + color] = [ dx, dy ];
      return font_map[str + ' ' + color];
    }
  };
  var before_full_width = false;
  for (var y = 0; y < 48; ++y) {
    for (var x = 0; x < 54; ++x) {
      var str = screen[y][x];
      if (!str) { // null is blank
        str = screen[y][x] = ' ';
      }
      var full_width = before_full_width;
      before_full_width = (str.indexOf("\0") !== -1); // if str have null-str, next str is full-width

      if (old_screen && str === old_screen[y][x]) { // no-updated
        continue;
      }

      var colors = SixtyNineClimbing.COLOR_REGEXP.exec(str);
      if (colors) {
        if (this.fillStyle !== colors[1]) {
          this.fillStyle = colors[1];
        }
        str = colors[2];
      } else {
        if (this.fillStyle !== 'black') {
          this.fillStyle = 'black';
        }
      }
      var dx = dw * (full_width ? x - 1 : x), dy = dh * y;
      var s = get_str_pos.call(this, str, this.fillStyle, full_width);
      var sx = s[0], sy = s[1], sw = (full_width ? dw * 2 : dw ), sh = dh;
      context.drawImage((full_width ? fontfw_map_element : font_map_element), sx, sy, sw, sh, dx, dy, (full_width ? dw * 2 : dw), dh);
    }
  }
  this.oldScreen = screen.map(function (row) { return row.concat(); });
};

},{"./69climbing":2}],2:[function(require,module,exports){
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

},{"./perlin":3}],3:[function(require,module,exports){
/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */

(function(global){
  var module = global.noise = {};

  function Grad(x, y, z) {
    this.x = x; this.y = y; this.z = z;
  }

  Grad.prototype.dot2 = function(x, y) {
    return this.x*x + this.y*y;
  };

  Grad.prototype.dot3 = function(x, y, z) {
    return this.x*x + this.y*y + this.z*z;
  };

  var grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
               new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
               new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];

  var p = [151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
  // To remove the need for index wrapping, double the permutation table length
  var perm = new Array(512);
  var gradP = new Array(512);

  // This isn't a very good seeding function, but it works ok. It supports 2^16
  // different seed values. Write something better if you need more seeds.
  module.seed = function(seed) {
    if(seed > 0 && seed < 1) {
      // Scale the seed out
      seed *= 65536;
    }

    seed = Math.floor(seed);
    if(seed < 256) {
      seed |= seed << 8;
    }

    for(var i = 0; i < 256; i++) {
      var v;
      if (i & 1) {
        v = p[i] ^ (seed & 255);
      } else {
        v = p[i] ^ ((seed>>8) & 255);
      }

      perm[i] = perm[i + 256] = v;
      gradP[i] = gradP[i + 256] = grad3[v % 12];
    }
  };

  module.seed(0);

  /*
  for(var i=0; i<256; i++) {
    perm[i] = perm[i + 256] = p[i];
    gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
  }*/

  // Skewing and unskewing factors for 2, 3, and 4 dimensions
  var F2 = 0.5*(Math.sqrt(3)-1);
  var G2 = (3-Math.sqrt(3))/6;

  var F3 = 1/3;
  var G3 = 1/6;

  // 2D simplex noise
  module.simplex2 = function(xin, yin) {
    var n0, n1, n2; // Noise contributions from the three corners
    // Skew the input space to determine which simplex cell we're in
    var s = (xin+yin)*F2; // Hairy factor for 2D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var t = (i+j)*G2;
    var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
    var y0 = yin-j+t;
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if(x0>y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      i1=1; j1=0;
    } else {    // upper triangle, YX order: (0,0)->(0,1)->(1,1)
      i1=0; j1=1;
    }
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6
    var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
    var y2 = y0 - 1 + 2 * G2;
    // Work out the hashed gradient indices of the three simplex corners
    i &= 255;
    j &= 255;
    var gi0 = gradP[i+perm[j]];
    var gi1 = gradP[i+i1+perm[j+j1]];
    var gi2 = gradP[i+1+perm[j+1]];
    // Calculate the contribution from the three corners
    var t0 = 0.5 - x0*x0-y0*y0;
    if(t0<0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot2(x0, y0);  // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.5 - x1*x1-y1*y1;
    if(t1<0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot2(x1, y1);
    }
    var t2 = 0.5 - x2*x2-y2*y2;
    if(t2<0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot2(x2, y2);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 70 * (n0 + n1 + n2);
  };

  // 3D simplex noise
  module.simplex3 = function(xin, yin, zin) {
    var n0, n1, n2, n3; // Noise contributions from the four corners

    // Skew the input space to determine which simplex cell we're in
    var s = (xin+yin+zin)*F3; // Hairy factor for 2D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var k = Math.floor(zin+s);

    var t = (i+j+k)*G3;
    var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
    var y0 = yin-j+t;
    var z0 = zin-k+t;

    // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
    // Determine which simplex we are in.
    var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
    var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
    if(x0 >= y0) {
      if(y0 >= z0)      { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
      else if(x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
      else              { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
    } else {
      if(y0 < z0)      { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
      else if(x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
      else             { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
    }
    // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
    // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
    // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
    // c = 1/6.
    var x1 = x0 - i1 + G3; // Offsets for second corner
    var y1 = y0 - j1 + G3;
    var z1 = z0 - k1 + G3;

    var x2 = x0 - i2 + 2 * G3; // Offsets for third corner
    var y2 = y0 - j2 + 2 * G3;
    var z2 = z0 - k2 + 2 * G3;

    var x3 = x0 - 1 + 3 * G3; // Offsets for fourth corner
    var y3 = y0 - 1 + 3 * G3;
    var z3 = z0 - 1 + 3 * G3;

    // Work out the hashed gradient indices of the four simplex corners
    i &= 255;
    j &= 255;
    k &= 255;
    var gi0 = gradP[i+   perm[j+   perm[k   ]]];
    var gi1 = gradP[i+i1+perm[j+j1+perm[k+k1]]];
    var gi2 = gradP[i+i2+perm[j+j2+perm[k+k2]]];
    var gi3 = gradP[i+ 1+perm[j+ 1+perm[k+ 1]]];

    // Calculate the contribution from the four corners
    var t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    if(t0<0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot3(x0, y0, z0);  // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    if(t1<0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
    }
    var t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    if(t2<0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
    }
    var t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    if(t3<0) {
      n3 = 0;
    } else {
      t3 *= t3;
      n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 32 * (n0 + n1 + n2 + n3);

  };

  // ##### Perlin noise stuff

  function fade(t) {
    return t*t*t*(t*(t*6-15)+10);
  }

  function lerp(a, b, t) {
    return (1-t)*a + t*b;
  }

  // 2D Perlin Noise
  module.perlin2 = function(x, y) {
    // Find unit grid cell containing point
    var X = Math.floor(x), Y = Math.floor(y);
    // Get relative xy coordinates of point within that cell
    x = x - X; y = y - Y;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255; Y = Y & 255;

    // Calculate noise contributions from each of the four corners
    var n00 = gradP[X+perm[Y]].dot2(x, y);
    var n01 = gradP[X+perm[Y+1]].dot2(x, y-1);
    var n10 = gradP[X+1+perm[Y]].dot2(x-1, y);
    var n11 = gradP[X+1+perm[Y+1]].dot2(x-1, y-1);

    // Compute the fade curve value for x
    var u = fade(x);

    // Interpolate the four results
    return lerp(
        lerp(n00, n10, u),
        lerp(n01, n11, u),
       fade(y));
  };

  // 3D Perlin Noise
  module.perlin3 = function(x, y, z) {
    // Find unit grid cell containing point
    var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
    // Get relative xyz coordinates of point within that cell
    x = x - X; y = y - Y; z = z - Z;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255; Y = Y & 255; Z = Z & 255;

    // Calculate noise contributions from each of the eight corners
    var n000 = gradP[X+  perm[Y+  perm[Z  ]]].dot3(x,   y,     z);
    var n001 = gradP[X+  perm[Y+  perm[Z+1]]].dot3(x,   y,   z-1);
    var n010 = gradP[X+  perm[Y+1+perm[Z  ]]].dot3(x,   y-1,   z);
    var n011 = gradP[X+  perm[Y+1+perm[Z+1]]].dot3(x,   y-1, z-1);
    var n100 = gradP[X+1+perm[Y+  perm[Z  ]]].dot3(x-1,   y,   z);
    var n101 = gradP[X+1+perm[Y+  perm[Z+1]]].dot3(x-1,   y, z-1);
    var n110 = gradP[X+1+perm[Y+1+perm[Z  ]]].dot3(x-1, y-1,   z);
    var n111 = gradP[X+1+perm[Y+1+perm[Z+1]]].dot3(x-1, y-1, z-1);

    // Compute the fade curve value for x, y, z
    var u = fade(x);
    var v = fade(y);
    var w = fade(z);

    // Interpolate
    return lerp(
        lerp(
          lerp(n000, n100, u),
          lerp(n001, n101, u), w),
        lerp(
          lerp(n010, n110, u),
          lerp(n011, n111, u), w),
       v);
  };

// for node.js, not for CommonJS
})(module.exports);
//})(this);

},{}]},{},[1])(1)
});