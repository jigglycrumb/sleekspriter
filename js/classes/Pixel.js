var Pixel = function() {
  return {
    fill: function() {
      var id = 'StageBoxLayer-'+editor.layer;
      var _canvas = document.getElementById(id),
          _ctx = _canvas.getContext('2d'),
          _color = editor.color.hexString(),
          _x = editor.pixel.x-1,
          _y = editor.pixel.y-1,
          _zoom = editor.zoom;

      _ctx.fillStyle = _color;
      _ctx.fillRect(_x*_zoom, _y*_zoom, _zoom, _zoom);

      signal.pixelFilled.dispatch(editor.layer, editor.pixel.x, editor.pixel.y, editor.color);
    },
    clear: function() {
      //console.log('clearing pixel');

      var id = 'StageBoxLayer-'+editor.layer;
      var _canvas = document.getElementById(id),
          _ctx = _canvas.getContext('2d'),
          _x = editor.pixel.x-1,
          _y = editor.pixel.y-1,
          _zoom = editor.zoom;

      _ctx.clearRect(_x*_zoom, _y*_zoom, _zoom, _zoom);

      signal.pixelCleared.dispatch(editor.layer, editor.pixel.x, editor.pixel.y);
    }
  };
};

var pixel = new Pixel();