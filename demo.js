var demo = {};

demo.tileSize = 32;

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
  demo.draw(demo.activeMap, demo.getZoom());
};

demo.map = function (width, height) {
  field = [];
  frontier = [];

  create(width, height);

  return field;
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
  context.fillStyle = "ffffff";
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

demo.getZoom = function () {
  return parseFloat(document.getElementById('zoom').value);
};

demo.getWidth = function () {
  return parseFloat(document.getElementById('width').value);
};

demo.getHeight = function () {
  return parseFloat(document.getElementById('height').value);
};

demo.createAndDraw = function () {
  var width = demo.getWidth();
  var height = demo.getHeight();

  demo.activeMap = demo.map(width, height);
  demo.draw(demo.activeMap, width, height, demo.getZoom());
};

window.onload = function () {
  var createButton = document.getElementById('create');
  var widthInput = document.getElementById('width');
  var heightInput = document.getElementById('height');
  var zoomInput = document.getElementById('zoom');
  var exportTiledJsonButton = document.getElementById('exportTiledJson');

  createButton.onclick = widthInput.onchange = heightInput.onchange =
    demo.createAndDraw;

  zoomInput.onchange = function () {
    demo.draw(demo.activeMap, demo.getWidth(), demo.getHeight(), demo.getZoom());
  };

  exportTiledJsonButton.onclick = function () {
    mapExport.tiledJson(demo.activeMap, demo.getWidth(), demo.getHeight(), demo.tileSize);
  };
  demo.createAndDraw();
};
