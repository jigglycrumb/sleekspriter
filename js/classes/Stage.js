var Stage = function() {

  function fillPixel(frame, pixel) {
    var color = new Color(pixel.toRgba());
    channel.publish('stage.pixel.fill', {
      frame: frame,
      layer: pixel.layer,
      x: pixel.x,
      y: pixel.y,
      color: color.hexString()
    });
  };

  return {

    frame: {
      refresh: function(frame) {

        console.log('refreshing frame '+frame);

        var frame = frame || editor.frame;

        this.clear();

        editor.pixels.frame.forEach(function(px) {
          var color = new Color(px.toRgba());
          channel.publish('stage.pixel.fill', {
            frame: frame,
            layer: px.layer,
            x: px.x,
            y: px.y,
            color: color.hexString()
          });
        });

        if(editor.selection.pixels.length > 0) {
          var framelayers = editor.layers.getIds();

          editor.selection.pixels.forEach(function(px) {
            if(inArray(framelayers, px.layer)) {
              var color = new Color(px.toRgba());
              channel.publish('stage.pixel.fill', {
                frame: frame,
                layer: px.layer,
                x: px.x,
                y: px.y,
                color: color.hexString()
              });
            }
          });
        }
      },
      clear: function() {
        editor.layers.frame.forEach(function(layer) {
          var c = document.getElementById('StageBoxLayer-'+layer.id);
          c.width = c.width;
        });
      }
    },




    layer: {
      refresh: function() {

        console.log('refreshing layer '+editor.layers.selected );

        var layerPixels = editor.pixels.layer,
            selectionPixels = _.where(editor.selection.pixels, {layer: editor.layers.selected}),
            frame = editor.frame;

        this.clear();

        layerPixels.forEach(function(px) {
          var color = new Color(px.toRgba());
          channel.publish('stage.pixel.fill', {
            frame: frame,
            layer: px.layer,
            x: px.x,
            y: px.y,
            color: color.hexString()
          });
        });

        selectionPixels.forEach(function(px) {
          var color = new Color(px.toRgba());
          channel.publish('stage.pixel.fill', {
            frame: frame,
            layer: px.layer,
            x: px.x,
            y: px.y,
            color: color.hexString()
          });
        });
      },
      clear: function() {
        var c = document.getElementById('StageBoxLayer-'+editor.layers.selected);
        c.width = c.width;
      }
    },
  }
};