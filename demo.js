var demo = {};

demo.width = 40;
demo.height = 20;

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

demo.clear = function () {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  var widthPx = demo.width * demo.tileSize;
  var heightPx = demo.height * demo.tileSize;

  canvas.width = widthPx;
  canvas.height = heightPx;

  context.fillStyle = "ffffff";
  context.clearRect(0, 0, canvas.width, canvas.height);
};

demo.zoom = function () {
  demo.draw(demo.activeMap, demo.getZoom());
};

demo.map = function () {
  field = [];
  frontier = [];

  init();
  create();

  return field;
};

demo.draw = function (map, zoom) {
  console.log('draw() started.');

  var tileSize = demo.tileSize * zoom;

  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  var widthPx = demo.width * demo.tileSize * zoom;
  var heightPx = demo.height * demo.tileSize * zoom;

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
  var zoomText = document.getElementById('zoom');
  return parseFloat(zoom.value);
};

window.onload = function () {
  demo.activeMap = demo.map();
  demo.draw(demo.activeMap, 1);
};
