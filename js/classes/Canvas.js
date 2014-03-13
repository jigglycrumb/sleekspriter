var Canvas = function() {

  return {
    frame: {
      refresh: function() {
        var pixels = _.where(io.pixels, {frame: editor.frame});

        //console.log('refreshing frame '+editor.frame);

        pixels.forEach(function(px) {
          canvas.pixel.fill(px.layer, px.x, px.y, Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')'));
        });

        //signal.pixelSelected.dispatch(0, 0);
      }
    },
    layer: {
      refresh: function() {
        var pixels = _.where(io.pixels, {frame: editor.frame, layer: editor.layer});

        //console.log('refreshing layer '+editor.layer);

        pixels.forEach(function(px) {
          canvas.pixel.fill(px.layer, px.x, px.y, Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')'));
        });

        //signal.pixelSelected.dispatch(0, 0);
      }
    },
    pixel: {
      fill: function(layer, x, y, color) {

        var dispatch = arguments.length == 0 ? true : false,
            layer = layer || editor.layer,
            x = x || editor.pixel.x,
            y = y || editor.pixel.y,
            color = color || editor.color,
            ctx = document.getElementById('StageBoxLayer-'+layer).getContext('2d'),
            zoom = editor.zoom;

        color = color.hexString();

        x--;
        y--;

        ctx.fillStyle = color;
        ctx.fillRect(x*zoom, y*zoom, zoom, zoom);

        if(dispatch === true) signal.pixelFilled.dispatch(editor.frame, editor.layer, editor.pixel.x, editor.pixel.y, editor.color);
      },
      clear: function(layer, x, y) {

        var dispatch = arguments.length == 0 ? true : false,
            layer = layer || editor.layer,
            x = x || editor.pixel.x,
            y = y || editor.pixel.y,
            ctx = document.getElementById('StageBoxLayer-'+layer).getContext('2d'),
            zoom = editor.zoom;

        x--;
        y--;

        ctx.clearRect(x*zoom, y*zoom, zoom, zoom);

        if(dispatch !== false) signal.pixelCleared.dispatch(editor.frame, editor.layer, editor.pixel.x, editor.pixel.y);
      }
    }
  }
};

var canvas = new Canvas();