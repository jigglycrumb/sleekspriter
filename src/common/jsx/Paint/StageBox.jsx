var StageBox = React.createClass({
  getInitialState: function() {
    return {
      mousedown: false,
      mousedownPoint: new Point(0, 0),
      last: null, // we need to record the mousedown timestamp because of a chrome bug,
                  // see https://code.google.com/p/chromium/issues/detail?id=161464
                  // and http://stackoverflow.com/questions/14538743/what-to-do-if-mousemove-and-click-events-fire-simultaneously
    };
  },
  render: function() {

    var w = this.props.editor.file.size.width * this.props.editor.zoom.current,
        h = this.props.editor.file.size.height * this.props.editor.zoom.current,
        centerAreaWidth = window.innerWidth - editor.offset.left - editor.offset.right,
        centerAreaHeight = window.innerHeight - editor.offset.top - editor.offset.bottom;

    var css = {
      width: w,
      height: h,
    };

    if( w > centerAreaWidth ) css.left = 0;
    else css.left = (centerAreaWidth - w)/2;

    if( h > centerAreaHeight ) css.top = 0;
    else css.top = (centerAreaHeight - h)/2;

    return (
      <div id="StageBox"
        style={css}
        onMouseDown={this.mousedown}
        onMouseMove={this.mousemove}
        onMouseUp={this.mouseup}>

        <StageBoxCursorCanvas width={w} height={h} editor={this.props.editor} />
        <StageBoxSelectionCanvas width={w} height={h} editor={this.props.editor} />
        <StageBoxGridCanvas width={w} height={h} editor={this.props.editor} />

        {this.props.editor.layers.frame.map(function(layer) {
          return (
            <StageBoxLayer
              key={layer.id}
              width={w}
              height={h}
              id={layer.id}
              layer={layer}
              stage={true} />
          );
        }, this)}

        <StageBoxBackground type={this.props.editor.background.type} value={this.props.editor.background.value} />
      </div>
    );
  },

  mousedown: function(event) {

    event = event.nativeEvent;

    var point = this.getWorldCoordinates(event),
        ok = true;

    switch(this.props.editor.tool.selected) {

      case 'BrushTool':
        ok = this.useBrushTool();
        break;

      case 'EraserTool':
        ok = this.useEraserTool();
        break;

      case 'BrightnessTool':
        ok = this.useBrightnessTool();
        break;

      case 'RectangularSelectionTool':
        this.startRectangularSelection(point);
        break;
    }

    if(ok) this.setState({mousedown: true, mousedownPoint: point, last: event.timeStamp});
  },

  mousemove: function(event) {

    event = event.nativeEvent;

    this.getLayerPixelColor(event);

    var point = this.getWorldCoordinates(event),
        distance = this.getMouseDownDistance();

    if(event.timeStamp > this.state.last + 10 && point.x > 0 && point.y > 0) {
      channel.gui.publish('cursor.set', {position: point});
    }

    if(this.state.mousedown === true) {

      switch(this.props.editor.tool.selected) {

        case 'BrushTool':
          this.useBrushTool();
          break;

        case 'EraserTool':
          this.useEraserTool();
          break;

        case 'RectangularSelectionTool':
          if(editor.selection.isActive) this.previewRectangularSelection(distance);
          else this.resizeRectangularSelection(point);
          break;

        case 'BrightnessTool':
          this.useBrightnessTool();
          break;

        case 'MoveTool':
          this.previewMoveTool();
          break;
      }
    }
  },

  mouseup: function(event) {

    event = event.nativeEvent;

    var point = this.getWorldCoordinates(event),
        distance = this.getMouseDownDistance(),
        ok = true;;

    this.setState({mousedown: false});

    switch(this.props.editor.tool.selected) {

      case 'EyedropperTool':
        this.useEyedropperTool();
        break;

      case 'RectangularSelectionTool':
        this.endRectangularSelection(point, distance);
        break;

      case 'PaintBucketTool':
        ok = this.usePaintBucketTool(point);
        break;

      case 'MoveTool':
        this.useMoveTool(point);
        break;
    }

    if(ok) this.props.editor.pixels.save();
  },


  getLayerPixelColor: function(event) {
    var ctx = document.getElementById('StageBoxLayer-'+this.props.editor.layers.selected).getContext('2d'),
        px = ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data,
        color = new Color({r:px[0], g:px[1], b:px[2], a:px[3]});

    editor.color.layer = color;
  },
  getWorldCoordinates: function(event) {
    return new Point(
      Math.ceil(event.layerX/this.props.editor.zoom.current),
      Math.ceil(event.layerY/this.props.editor.zoom.current)
    );
  },
  getMouseDownDistance: function() {
    return new Point(
      editor.cursor.position.x - this.state.mousedownPoint.x,
      editor.cursor.position.y - this.state.mousedownPoint.y
    );
  },







  useBrushTool: function() {
    if(isLayerVisible()) {
      if(!editor.selection.isActive) {
        Pixel.add(editor.frames.selected, editor.layers.selected, editor.cursor.position.x, editor.cursor.position.y,
                      file.getLayerById(editor.layers.selected).z, editor.color.brush.hexString());
      }
      else { // restrict to selection
        if(editor.selection.contains(editor.cursor.position)) {
          Pixel.add(editor.frames.selected, editor.layers.selected, editor.cursor.position.x, editor.cursor.position.y,
                        file.getLayerById(editor.layers.selected).z, editor.color.brush.hexString());
        }
      }
      return true;
    }
    else return this.showInvisibleLayerError();
  },
  useEraserTool: function() {
    if(isLayerVisible()) {
      if(!editor.selection.isActive) {
        Pixel.delete(editor.frames.selected, editor.layers.selected,
                     editor.cursor.position.x, editor.cursor.position.y,
                     file.getLayerById(editor.layers.selected).z);
      }
      else { // restrict to selection
        if(editor.selection.contains(editor.cursor.position)) {
          Pixel.delete(editor.frames.selected, editor.layers.selected,
                       editor.cursor.position.x, editor.cursor.position.y,
                       file.getLayerById(editor.layers.selected).z);
        }
      }
      return true;
    }
    else return this.showInvisibleLayerError();
  },
  useEyedropperTool: function() {
    if(editor.color.frame.alpha() == 0) return; // skip transparent pixels
    channel.gui.publish('tool.select', {tool: 'BrushTool'});
    channel.gui.publish('color.select', {color: editor.color.frame.hexString()});
  },
  usePaintBucketTool: function(point) {
    if(isLayerVisible()) {
      if(editor.selection.isActive) {
        if(editor.selection.contains(point)) channel.gui.publish('stage.tool.paintbucket', {point: point});
      }
      else channel.gui.publish('stage.tool.paintbucket', {point: point});
      return true;
    }
    else return this.showInvisibleLayerError();
  },
  useBrightnessTool: function() {

    if(isLayerVisible()) {

      function lighten() {
        if(editor.color.layer.alpha() == 0) return; // skip transparent pixels
        var newColor = changeColorLightness(editor.color.layer, editor.brightnessTool.intensity);
        Pixel.add(editor.frames.selected, editor.layers.selected, editor.cursor.position.x, editor.cursor.position.y,
              file.getLayerById(editor.layers.selected).z, newColor.hexString());
      };

      function darken() {
        if(editor.color.layer.alpha() == 0) return; // skip transparent pixels
        var newColor = changeColorLightness(editor.color.layer, -editor.brightnessTool.intensity);
        Pixel.add(editor.frames.selected, editor.layers.selected, editor.cursor.position.x, editor.cursor.position.y,
              file.getLayerById(editor.layers.selected).z, newColor.hexString());
      };

      var px = _.findWhere(editor.pixels.scope, {x: editor.cursor.position.x, y: editor.cursor.position.y }),
          pixelExists = !_.isUndefined(px);

      if(pixelExists) {
        if(!editor.selection.isActive) {
          if(editor.brightnessTool.mode == 'lighten') lighten();
          else if(editor.brightnessTool.mode == 'darken') darken();
        }
        else { // restrict to selection
          if(editor.selection.contains(editor.cursor.position)) {
            if(editor.brightnessTool.mode == 'lighten') lighten();
            else if(editor.brightnessTool.mode == 'darken') darken();
          }
        }
      }
      return true;
    }
    else return this.showInvisibleLayerError();
  },




  previewMoveTool: function() {
    var distance = this.getMouseDownDistance(),
        canvas = document.getElementById('StageBoxLayer-'+editor.layers.selected),
        pixels = [];

    if(editor.selection.isActive) this.previewRectangularSelection(distance);

    editor.pixels.frame.forEach(function(px) {
      if(px.layer === editor.layers.selected) pixels.push(px);
    });

    editor.pixels.scope.forEach(function(px) {
      pixels.push(px.wrap(distance, true));
    });

    channel.gui.publish('canvas.preview', {
      frame: editor.frames.selected,
      layer: editor.layers.selected,
      pixels: pixels,
    });
  },
  useMoveTool: function(distance) {
    channel.gui.publish('pixels.move', {distance: distance});
    if(editor.selection.isActive) {
      channel.gui.publish('selection.move', {distance: distance});
    }
  },




  startRectangularSelection: function(point) {
    if(!editor.selection || !editor.selection.contains(point)) {
      channel.gui.publish('selection.clear');
      channel.gui.publish('selection.start', {point: point});
    }
  },
  resizeRectangularSelection: function(point) {
    channel.gui.publish('selection.resize', {point: point});
  },
  previewRectangularSelection: function(distance) {
    channel.gui.publish('selection.preview', {distance: distance});
  },
  endRectangularSelection: function(point, distance) {
    if(editor.selection.isActive) {
      channel.gui.publish('selection.move', {distance: distance});
    }
    else {
      if(_.isEqual(point, this.state.mousedownPoint))
        channel.gui.publish('selection.clear');
      else
        channel.gui.publish('selection.end', {point: point});
    }
  },
  showInvisibleLayerError: function() {
    channel.gui.publish('modal.show', {component: ModalErrorInvisibleLayer});
    return false;
  },

});