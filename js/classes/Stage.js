var Stage = function() {

  return {

    frame: {
      refresh: function(frame) {

        console.log('refreshing frame '+frame);

        var frame = frame || editor.frame.selected;

        this.clear();

        editor.pixels.frame.forEach(function(px) {
          var color = new Color(px.toRgba());
          Pixel.add(frame, px.layer, px.x, px.y, px.z, px.toHex());
        });

        if(editor.pixels.selection.length > 0) {
          var framelayers = editor.layers.getIds();

          editor.pixels.selection.forEach(function(px) {
            if(inArray(framelayers, px.layer)) Pixel.add(frame, px.layer, px.x, px.y, px.z, px.toHex());
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
            selectionPixels = _.where(editor.pixels.selection, {layer: editor.layers.selected}),
            frame = editor.frame.selected;

        this.clear();

        layerPixels.forEach(function(px) {
          var color = new Color(px.toRgba());
          Pixel.add(frame, px.layer, px.x, px.y, px.z, px.toHex());
        });

        selectionPixels.forEach(function(px) {
          var color = new Color(px.toRgba());
          Pixel.add(frame, px.layer, px.x, px.y, px.z, px.toHex());
        });
      },
      clear: function() {
        var c = document.getElementById('StageBoxLayer-'+editor.layers.selected);
        c.width = c.width;
      }
    },
  }
};