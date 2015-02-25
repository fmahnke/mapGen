var field = [];
var frontier = [];

var wall = '#';
var empty = '.';
var exUn = ',';
var unExUn = '?';

var growingtree = {};

growingtree.range = function (begin, end) {
  var result = [];

  for (var i = begin; i < end; ++i){
      result.push(i);
  }
  return result;
};

growingtree.carve = function (y, x, width, height) {
  var extra = [];

  field[y][x] = empty;

  if (x > 0) {
    if (field[y][x - 1] === unExUn) {
      field[y][x - 1] = exUn;
      extra.push([y, x - 1]);
    }
  }
  if (x < width - 1) {
    if (field[y][x + 1] === unExUn) {
      field[y][x + 1] = exUn;
      extra.push([y, x + 1]);
    }
  }
  if (y > 0) {
    if (field[y - 1][x] === unExUn) {
      field[y - 1][x] = exUn;
      extra.push([y - 1, x]);
    }
  }
  if (y < height - 1) {
    if (field[y + 1][x] === unExUn) {
      field[y + 1][x] = exUn;
      extra.push([y + 1, x]);
    }
  }
  var shuffledExtra = knuthShuffle(extra);

  frontier = frontier.concat(shuffledExtra);
};

growingtree.print = function () {
  for (var y in growingtree.range(0, height)) {
    var s = '';

    for (var x in growingtree.range(0, width)) {
      s += field[y][x];
    }
    console.log(s);
  }
};

growingtree.harden = function (y, x) {
  field[y][x] = wall;
};

growingtree.check = function (y, x, width, height, nodiagonals) {
  var edgestate = 0;

  if (x > 0) {
    if (field[y][x - 1] === empty) {
      edgestate += 1;
    }
  }
  if (x < width - 1) {
    if (field[y][x + 1] === empty) {
      edgestate += 2;
    }
  }
  if (y > 0) {
    if (field[y - 1][x] === empty) {
      edgestate += 4;
    }
  }
  if (y < height - 1) {
    if (field[y + 1][x] === empty) {
      edgestate += 8;
    }
  }

  if (nodiagonals) {
    if (edgestate === 1) {
      if (x < width - 1) {
        if (y > 0) {
          if (field[y - 1][x + 1] === empty) return false;
        }
        if (y < height - 1) {
          if (field[y + 1][x + 1] === empty) return false;
        }
      }
      return true;
    } else if (edgestate === 2) {
      if (x > 0) {
        if (y > 0) {
          if (field[y - 1][x - 1] === empty) return false;
        }
        if (y < height - 1) {
          if (field[y + 1][x - 1] === empty) return false;
        }
      }
      return true;
    } else if (edgestate === 4) {
      if (y < height - 1) {
        if (x > 0) {
          if (field[y + 1][x - 1] === empty) return false;
        }
        if (x < width - 1) {
          if (field[y + 1][x + 1] === empty) return false;
        }
      }
      return true;
    } else if (edgestate === 8) {
      if (y > 0) {
        if (x > 0) {
          if (field[y - 1][x - 1] === empty) return false;
        }
        if (x < width - 1) {
          if (field[y - 1][x + 1] === empty) return false;
        }
      }
      return true;
    }
    return false;
  } else {
    // diagonal walls are permitted
    // not implemented
  }
};

growingtree.create = function (width, height, branchrate) {
  // TODO: parameter checking

  var init = function () {
    for (var h in growingtree.range(0, height)) {
      var row = [];

      for (var i in growingtree.range(0, width)) {
        row.push(unExUn);
      }
      field.push(row);
    }

    var initX = Math.ceil(Math.random() * width) - 1;
    var initY = Math.ceil(Math.random() * height) - 1;

    console.log('Chose init point x ' + initX + ' y ' + initY);
    console.log(frontier);
    growingtree.carve(initY, initX, width, height);
    console.log(frontier[0]);
    console.log(frontier[1]);
    console.log(frontier[2]);
    console.log(frontier[3]);

  };
  init();

  while (frontier.length > 0) {
    var pos = Math.random();

    pos = Math.pow(pos, Math.pow(Math.E, -branchrate));

    var choice = frontier[Math.floor(pos * frontier.length)];

    if (growingtree.check(choice[0], choice[1], width, height, true)) {
      growingtree.carve(choice[0], choice[1], width, height);
    } else {
      growingtree.harden(choice[0], choice[1]);
    }
    frontier = frontier.filter(function (element) {
      return (element !== choice);
    });
  }

  for (var y in growingtree.range(0, height)) {
    for (var x in growingtree.range(width)) {
      if (field[y][x] === unExUn) {
        field[y][x] = wall;
      }
    }
  }

  return field;
};

