var Stage = function() {

  return {
    frame: {
      refresh: function(frame) {

        var frame = frame || editor.frame;

        this.clear();

        var frameLayers = _.where(file.layers, {frame: editor.frame});
        var pixels = [];

        frameLayers.forEach(function(frameLayer) {
          pixels.push(_.where(file.pixels, {layer: frameLayer.id}));
        });

        pixels = _.flatten(pixels, true);

        //console.log('refreshing frame '+editor.frame, pixels);

        pixels.forEach(function(px) {
          stage.pixel.fill(px.layer, px.x, px.y, Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')'));
        });

        //signal.pixelSelected.dispatch(0, 0);
      },
      clear: function() {
        file.layers.forEach(function(layer) {
          var c = document.getElementById('StageBoxLayer-'+layer.id);
          c.width = c.width;
        });
      }
    },
    layer: {
      refresh: function() {
        var pixels = _.where(file.pixels, {layer: editor.layer});

        //console.log('refreshing layer '+editor.layer);

        pixels.forEach(function(px) {
          stage.pixel.fill(px.layer, px.x, px.y, Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')'));
        });

        //signal.pixelSelected.dispatch(0, 0);
      }
    },
    pixel: {
      fill: function(layer, x, y, color, forceDispatch) {

        var dispatch = forceDispatch || arguments.length == 0 ? true : false,
            layer = layer || editor.layer,
            x = x || editor.pixel.x,
            y = y || editor.pixel.y,
            color = color || editor.color,
            ctx = document.getElementById('StageBoxLayer-'+layer).getContext('2d'),
            zoom = editor.zoom;

        x--;
        y--;

        ctx.fillStyle = color.hexString();
        ctx.fillRect(x*zoom, y*zoom, zoom, zoom);

        if(dispatch === true) signal.file.pixelFilled.dispatch(layer, x, y, color);
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

        if(dispatch === true) signal.file.pixelCleared.dispatch(layer, x, y);
      },
      lighten: function(layer, x, y) {
        var newColor = new Color(editor.layerPixelColor.rgb());
        var l = newColor.hsl().l;
        l+= editor.brightnessToolIntensity;

        newColor.values.hsl[2] = l;
        newColor.setValues("hsl", newColor.values.hsl);

        this.fill(layer, x, y, newColor, true);
        editor.layerPixelColor = newColor;
      },
      darken: function(layer, x, y) {
        var newColor = new Color(editor.layerPixelColor.rgb());
        var l = newColor.hsl().l;
        l-= editor.brightnessToolIntensity;

        newColor.values.hsl[2] = l;
        newColor.setValues("hsl", newColor.values.hsl);

        this.fill(layer, x, y, newColor, true);
        editor.layerPixelColor = newColor;
      },
    }
  }
};

var stage = new Stage();