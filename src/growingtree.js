var width = 40;
var height = 20;

var field = [];
var frontier = [];

var wall = '#';
var empty = '.';
var exUn = ',';
var unExUn = '?';

var range = function (begin, end) {
  var result = [];

  for (var i = begin; i < end; ++i){
      result.push(i);
  }
  return result;
};

var carve = function (y, x) {
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

var init = function () {
  for (var h in range(0, height)) {
    var row = [];

    for (var i in range(0, width)) {
      row.push(unExUn);
    }
    field.push(row);
  }

  var initX = Math.ceil(Math.random() * width) - 1;
  var initY = Math.ceil(Math.random() * height) - 1;

  console.log('Chose init point x ' + initX + ' y ' + initY);
  console.log(frontier);
  carve(initY, initX);
  console.log(frontier[0]);
  console.log(frontier[1]);
  console.log(frontier[2]);
  console.log(frontier[3]);

};

var print = function () {
  for (var y in range(0, height)) {
    var s = '';

    for (var x in range(0, width)) {
      s += field[y][x];
    }
    console.log(s);
  }
};

var harden = function (y, x) {
  field[y][x] = wall;
};

var check = function (y, x, nodiagonals) {
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

var create = function () {
  var branchrate = 0;

  while (frontier.length > 0) {
    var pos = Math.random();

    pos = Math.pow(pos, Math.pow(Math.E, -branchrate));

    var choice = frontier[Math.floor(pos * frontier.length)];

    if (check(choice[0], choice[1], true)) {
      carve(choice[0], choice[1]);
    } else {
      harden(choice[0], choice[1]);
    }
    frontier = frontier.filter(function (element) {
      return (element !== choice);
    });
  }

  for (var y in range(0, height)) {
    for (var x in range(width)) {
      if (field[y][x] === unExUn) {
        field[y][x] = wall;
      }
    }
  }

  return field;
};

