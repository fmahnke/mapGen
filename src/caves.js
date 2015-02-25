var caves = {};

caves.randomRow = function (width, fillRate) {
  var empty = mapGen.repeat(0, width);

  return empty.map(function (element) {
    return (Math.random() < fillRate) ? mapGen.legend.wall :
      mapGen.legend.empty;
  });

};

caves.randomMap = function (width, height, fillRate) {
  var empty = mapGen.repeat(0, height);

  return empty.map(function (element) {
    return caves.randomRow(width, fillRate);
  });
};

/**
 * 
It is an old and fairly well documented trick to use cellular automata to generate cave-like structures. The basic idea is to fill the first map randomly, then repeatedly create new maps using the 4-5 rule: a tile becomes a wall if it was a wall and 4 or more of its eight neighbors were walls, or if it was not a wall and 5 or more neighbors were. Put more succinctly, a tile is a wall if the 3x3 region centered on it contained at least 5 walls. Each iteration makes each tile more like its neighbors, and the amount of overall "noise" is gradually reduced: 
*/
caves.fourFive = function (field, width, height) {
  var newField = [];

  var isWall = function (value) {
    return (value === undefined || value === mapGen.legend.wall);
  };

  var threeByThree = function (y, x) {
    var rowNums = [y - 1, y, y + 1];

    return [].concat.apply([], rowNums.map(function (rowNum) {
      if (field[rowNum] === undefined) {
        return mapGen.repeat(mapGen.legend.wall, 3);
      } else {
        return [field[rowNum][x - 1], field[rowNum][x], field[rowNum][x + 1]];
      }
    }));
  };

  for (var y = 0; y < height; ++y) {
    newField.push([]);

    for (var x = 0; x < width; ++x) {
      var threeSquared = threeByThree(y, x);

      var walls = threeSquared.filter(function (element) {
        return isWall(element);
      });

      if (walls.length >= 5) {
        newField[y][x] = mapGen.legend.wall;
      } else {
        newField[y][x] = mapGen.legend.empty;
      }
    }
  }
  return newField;
};

caves.create = function (width, height, firstPassFillRate, iterations) {
  var map = caves.randomMap(width, height, firstPassFillRate, iterations);

  for (var i = 0; i < iterations; ++i) {
    map = caves.fourFive(map, width, height);
  }
  mapGen.print(map, width, height);

  return map;
};
