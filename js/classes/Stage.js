var Stage = function() {

  return {
    frame: {
      refresh: function(frame) {

        var frame = frame || editor.frame;

        this.clear();

        editor.pixels.forEach(function(px) {
          stage.pixel.fill(px.layer, px.x, px.y, Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')'));
        });

        if(editor.selection.pixels.length > 0) {
          var framelayers = _.pluck(_.where(file.layers, {frame: editor.frame}), 'id');

          editor.selection.pixels.forEach(function(px) {
            if(inArray(framelayers, px.layer)) stage.pixel.fill(px.layer, px.x, px.y, Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')'));
          });
        }
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
        var layerPixels = _.where(editor.pixels, {layer: editor.layer}),
            selectionPixels = _.where(editor.selection.pixels, {layer: editor.layer});

        this.clear();

        layerPixels.forEach(function(px) {
          stage.pixel.fill(px.layer, px.x, px.y, Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')'));
        });

        selectionPixels.forEach(function(px) {
          stage.pixel.fill(px.layer, px.x, px.y, Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')'));
        });
      },
      clear: function() {
        var c = document.getElementById('StageBoxLayer-'+editor.layer);
        c.width = c.width;
      }
    },
    pixel: {
      fill: function(layer, x, y, color, forceDispatch) {

        //console.log('filling pixel', layer, x, y);

        var dispatch = forceDispatch || arguments.length == 0 ? true : false,
            layer = layer || editor.layer,
            x = x || editor.pixel.x,
            y = y || editor.pixel.y,
            color = color || editor.color,
            ctx = document.getElementById('StageBoxLayer-'+layer).getContext('2d'),
            zoom = editor.zoom,
            cX = x -1,
            cY = y -1;

        ctx.fillStyle = color.hexString();
        ctx.fillRect(cX*zoom, cY*zoom, zoom, zoom);

        if(dispatch === true) channel.publish('stage.pixel.fill', {layer: layer, x: x, y: y, color: color.hexString()});
      },
      clear: function(layer, x, y) {

        var dispatch = arguments.length == 0 ? true : false,
            layer = layer || editor.layer,
            x = x || editor.pixel.x,
            y = y || editor.pixel.y,
            ctx = document.getElementById('StageBoxLayer-'+layer).getContext('2d'),
            zoom = editor.zoom,
            cX = x -1,
            cY = y -1;

        ctx.clearRect(cX*zoom, cY*zoom, zoom, zoom);

        if(dispatch === true) channel.publish('stage.pixel.clear', {layer: layer, x: x, y: y});
      },
      lighten: function(layer, x, y) {
        if(editor.layerPixelColor.alpha() == 0) return; // skip transparent pixels
        var newColor = changeColorLightness(editor.layerPixelColor, editor.brightnessTool.intensity);
        this.fill(layer, x, y, newColor, true);
        editor.layerPixelColor = newColor;
      },
      darken: function(layer, x, y) {
        if(editor.layerPixelColor.alpha() == 0) return; // skip transparent pixels
        var newColor = changeColorLightness(editor.layerPixelColor, -editor.brightnessTool.intensity);
        this.fill(layer, x, y, newColor, true);
        editor.layerPixelColor = newColor;
      },
    }
  }
};