var demo = {};

demo.tileSize = 16;

demo.tileValues = {
  empty: 0,
  wall: 1
};

demo.activeMap = null;

demo.setupContext = function (context, tileValue) {
  if (tileValue === demo.tileValues.empty) {
    context.fillStyle = '#000000';
  } else if (tileValue === demo.tileValues.wall) {
    context.fillStyle = '#ff0000';
  }
};

demo.zoom = function () {
  demo.draw(demo.activeMap, demo.valueAsNumber('zoom'));
};

demo.map = function (width, height, branchrate) {
  return growingtree.create(width, height, branchrate);
};

demo.draw = function (map, width, height, zoom) {
  console.log('draw() started.');

  var tileSize = demo.tileSize * zoom;

  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  var widthPx = width * demo.tileSize * zoom;
  var heightPx = height * demo.tileSize * zoom;

  canvas.width = widthPx;
  canvas.height = heightPx;

  context.fillStyle = "#eeeeee";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#334466";
  context.strokeStyle = "#334466";
  context.font = "12px Arial";

  console.log('draw() clear canvas.');

  console.log('z ' + zoom);
  context.clearRect(0, 0, canvas.width, canvas.height);

  var cellY = 0;

  for (var r = 0; r < map.length; ++r) {
    var row = map[r];

    for (var c = 0; c < row.length; ++c) {
      var node = row[c];

      var cx = c * demo.tileSize * zoom;
      var cy = cellY;

      if (node === '.') {
        demo.setupContext(context, demo.tileValues.empty);
      } else if (node === '#') {
        demo.setupContext(context, demo.tileValues.wall);
      }

      context.fillRect(cx, cy, demo.tileSize * zoom, demo.tileSize * zoom);

    } 
    cellY += demo.tileSize * zoom;
  }

  console.log(map);
  console.log('draw() finished.');
};

demo.valueAsNumber = function (elementId) {
  return parseFloat(document.getElementById(elementId).value);
};

demo.createAndDraw = function () {
  var width = demo.valueAsNumber('width');
  var height = demo.valueAsNumber('height');
  var branchrate = demo.valueAsNumber('branchrate');
  var zoom = demo.valueAsNumber('zoom');

  demo.activeMap = demo.map(width, height, branchrate);
  demo.draw(demo.activeMap, width, height, zoom);
};

window.onload = function () {
  var createButton = document.getElementById('create');
  var widthInput = document.getElementById('width');
  var heightInput = document.getElementById('height');
  var zoomInput = document.getElementById('zoom');
  var exportTiledJsonButton = document.getElementById('exportTiledJson');

  var mapVisible = document.getElementById('mapVisible');
  var dataVisible = document.getElementById('dataVisible');

  createButton.onclick = widthInput.onchange = heightInput.onchange =
    demo.createAndDraw;

  zoomInput.onchange = function () {
    demo.draw(demo.activeMap, demo.valueAsNumber('width'), demo.valueAsNumber('height'),
      demo.valueAsNumber('zoom'));
  };

  exportTiledJsonButton.onclick = function () {
    var json = mapExport.tiledJson(demo.activeMap, demo.valueAsNumber('width'),
      demo.valueAsNumber('height'), demo.tileSize);
    var textArea = document.getElementById('export');
    textArea.textContent = json;
  };

  mapVisible.onchange = function () {
    if (! mapVisible.checked) {
      document.getElementById('canvas').hidden = true;
    } else {
      document.getElementById('canvas').hidden = false;
    }
  };

  dataVisible.onchange = function () {
    if (! dataVisible.checked) {
      document.getElementById('data').hidden = true;
    } else {
      document.getElementById('data').hidden = false;
    }
  };
  demo.createAndDraw();
};
