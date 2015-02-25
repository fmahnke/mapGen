var growingtree = {};

growingtree.carve = function (field, frontier, y, x, width, height) {
  var extra = [];

  field[y][x] = mapGen.legend.empty;

  if (x > 0) {
    if (field[y][x - 1] === mapGen.legend.unexposedAndUndetermined) {
      field[y][x - 1] = mapGen.legend.exposedAndUndetermined;
      extra.push([y, x - 1]);
    }
  }
  if (x < width - 1) {
    if (field[y][x + 1] === mapGen.legend.unexposedAndUndetermined) {
      field[y][x + 1] = mapGen.legend.exposedAndUndetermined;
      extra.push([y, x + 1]);
    }
  }
  if (y > 0) {
    if (field[y - 1][x] === mapGen.legend.unexposedAndUndetermined) {
      field[y - 1][x] = mapGen.legend.exposedAndUndetermined;
      extra.push([y - 1, x]);
    }
  }
  if (y < height - 1) {
    if (field[y + 1][x] === mapGen.legend.unexposedAndUndetermined) {
      field[y + 1][x] = mapGen.legend.exposedAndUndetermined;
      extra.push([y + 1, x]);
    }
  }
  var shuffledExtra = knuthShuffle(extra);

  frontier = frontier.concat(shuffledExtra);

  return {
    field: field,
    frontier: frontier
  };
};

growingtree.harden = function (field, y, x) {
  field[y][x] = mapGen.legend.wall;
};

growingtree.check = function (field, y, x, width, height, nodiagonals) {
  var edgestate = 0;

  if (x > 0) {
    if (field[y][x - 1] === mapGen.legend.empty) {
      edgestate += 1;
    }
  }
  if (x < width - 1) {
    if (field[y][x + 1] === mapGen.legend.empty) {
      edgestate += 2;
    }
  }
  if (y > 0) {
    if (field[y - 1][x] === mapGen.legend.empty) {
      edgestate += 4;
    }
  }
  if (y < height - 1) {
    if (field[y + 1][x] === mapGen.legend.empty) {
      edgestate += 8;
    }
  }

  if (nodiagonals) {
    if (edgestate === 1) {
      if (x < width - 1) {
        if (y > 0) {
          if (field[y - 1][x + 1] === mapGen.legend.empty) return false;
        }
        if (y < height - 1) {
          if (field[y + 1][x + 1] === mapGen.legend.empty) return false;
        }
      }
      return true;
    } else if (edgestate === 2) {
      if (x > 0) {
        if (y > 0) {
          if (field[y - 1][x - 1] === mapGen.legend.empty) return false;
        }
        if (y < height - 1) {
          if (field[y + 1][x - 1] === mapGen.legend.empty) return false;
        }
      }
      return true;
    } else if (edgestate === 4) {
      if (y < height - 1) {
        if (x > 0) {
          if (field[y + 1][x - 1] === mapGen.legend.empty) return false;
        }
        if (x < width - 1) {
          if (field[y + 1][x + 1] === mapGen.legend.empty) return false;
        }
      }
      return true;
    } else if (edgestate === 8) {
      if (y > 0) {
        if (x > 0) {
          if (field[y - 1][x - 1] === mapGen.legend.empty) return false;
        }
        if (x < width - 1) {
          if (field[y - 1][x + 1] === mapGen.legend.empty) return false;
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

growingtree.init = function (map, width, height) {
  for (var h in mapGen.range(0, height)) {
    var row = [];

    for (var i in mapGen.range(0, width)) {
      row.push(mapGen.legend.unexposedAndUndetermined);
    }
    map.field.push(row);
  }

  var initX = Math.ceil(Math.random() * width) - 1;
  var initY = Math.ceil(Math.random() * height) - 1;

  console.log('Chose init point x ' + initX + ' y ' + initY);
  console.log(map.frontier);

  return growingtree.carve(map.field, map.frontier, initY, initX, width, height);
};

growingtree.create = function (width, height, branchrate) {
  // TODO: parameter checking

  var map = {
    field: [],
    frontier: []
  };

  map = growingtree.init(map, width, height);

  while (map.frontier.length > 0) {
    var pos = Math.random();

    pos = Math.pow(pos, Math.pow(Math.E, -branchrate));

    var choice = map.frontier[Math.floor(pos * map.frontier.length)];

    if (growingtree.check(map.field, choice[0], choice[1], width, height, true)) {
      map = growingtree.carve(map.field, map.frontier, choice[0], choice[1], width, height);
    } else {
      growingtree.harden(map.field, choice[0], choice[1]);
    }
    map.frontier = map.frontier.filter(function (element) {
      return (element !== choice);
    });
  }

  for (var y in mapGen.range(0, height)) {
    for (var x in mapGen.range(width)) {
      if (map.field[y][x] === mapGen.legend.unexposedAndUndetermined) {
        map.field[y][x] = mapGen.legend.wall;
      }
    }
  }

  return map.field;
};

