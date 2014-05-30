var Stage = function() {

  return {

    frame: {
      refresh: function(frame) {

        var frame = frame || editor.frame;

        this.clear();

        editor.pixels.forEach(function(px) {
          var color = new Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')');
          channel.publish('stage.pixel.fill', {
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
              var color = new Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')');
              channel.publish('stage.pixel.fill', {
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
        var layerPixels = _.where(editor.pixels, {layer: editor.layers.selected}),
            selectionPixels = _.where(editor.selection.pixels, {layer: editor.layers.selected});

        this.clear();

        layerPixels.forEach(function(px) {
          var color = new Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')');
          channel.publish('stage.pixel.fill', {
            layer: px.layer,
            x: px.x,
            y: px.y,
            color: color.hexString()
          });
        });

        selectionPixels.forEach(function(px) {
          var color = new Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')');
          channel.publish('stage.pixel.fill', {
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