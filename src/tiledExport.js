var mapExport = {};

mapExport.tiledJson = function (map, width, height, tileSize) {
  var mapToTiledData = function (map) {
    var newRows = [];

    for (var r = 0; r < map.length; ++r) {
      var row = map[r];

      var newRow = [];

      for (var c = 0; c < row.length; ++c) {

        if (row[c] === '.') {
          newRow.push(0);
        } else {
          newRow.push(1);
        }
      }
      newRows.push(newRow);
    }

    var flat = [].concat.apply([], newRows);
    return flat;
  };

  var version = 1;

  var tiled = {
    height: height,
    layers: [
      {
        data: mapToTiledData(map),
        height: height,
        name: "Tile Layer 1",
        opacity: 1,
        type: "tilelayer",
        visible: true,
        width: width,
        x: 0,
        y: 0
      }
    ],
    nextobjectid: 1,
    orientation: "orthogonal",
    properties: {},
    renderorder: "right-down",
    tileheight: tileSize,
    tilesets: [
      {
        firstgid: 1,
        image: "pathToImage.tif",
        imageheight: 0,
        imagewidth: 0,
        margin: 0,
        name: "Change Me",
        properties: {},
        spacing: 0,
        tileheight: tileSize,
        tilewidth: tileSize
      }
    ],
    tilewidth: tileSize,
    version: 1,
    width: width
  };

  console.log(JSON.stringify(tiled));
};
