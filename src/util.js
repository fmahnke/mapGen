var mapGen = {
  legend: {
    wall: '#',
    empty: '.',
    exposedAndUndetermined: ',',
    unexposedAndUndetermined: '?'
  }
};

mapGen.repeat = function (value, times) {
  return Array.apply(null, new Array(times)).map(function () {
    return value;
  });
};

mapGen.range = function (begin, end) {
  var result = [];

  for (var i = begin; i < end; ++i) {
      result.push(i);
  }
  return result;
};

mapGen.print = function (field, width, height) {
  for (var y in mapGen.range(0, height)) {
    var s = '';

    for (var x in mapGen.range(0, width)) {
      s += field[y][x];
    }
    console.log(s);
  }
};

