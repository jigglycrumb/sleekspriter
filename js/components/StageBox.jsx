/** @jsx React.DOM */
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

    var w = this.props.editor.file.size.width*this.props.editor.zoom.current,
        h = this.props.editor.file.size.height*this.props.editor.zoom.current,
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
          var id = 'StageBoxLayer-'+layer.id;
          return (
            <StageBoxLayer
              key={id}
              width={w}
              height={h}
              id={layer.id}
              layer={layer} />
          );
        }, this)}

        <StageBoxBackground type={this.props.editor.background.type} value={this.props.editor.background.value} />
      </div>
    );
  },

  mousedown: function(event) {

    event = event.nativeEvent;

    var point = this.getWorldCoordinates(event);

    switch(this.props.editor.tool.selected) {

      case 'BrushTool':
        this.useBrushTool();
        break;

      case 'EraserTool':
        this.useEraserTool();
        break;

      case 'BrightnessTool':
        this.useBrightnessTool();
        break;

      case 'RectangularSelectionTool':
        this.startRectangularSelection(point);
        break;
    }

    this.setState({mousedown: true, mousedownPoint: point, last: event.timeStamp});
  },

  mousemove: function(event) {

    event = event.nativeEvent;

    this.getLayerPixelColor(event);

    var point = this.getWorldCoordinates(event),
        distance = this.getMouseDownDistance();

    if(event.timeStamp > this.state.last + 10 && point.x > 0 && point.y > 0) {
      channel.publish('app.cursor.set', {position: point});
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
          this.useMoveTool();
          break;
      }
    }
  },

  mouseup: function(event) {

    event = event.nativeEvent;

    var point = this.getWorldCoordinates(event),
        distance = this.getMouseDownDistance();

    this.setState({mousedown: false});

    switch(this.props.editor.tool) {

      case 'EyedropperTool':
        this.useEyedropperTool();
        break;

      case 'RectangularSelectionTool':
        this.endRectangularSelection(point, distance);
        break;

      case 'PaintBucketTool':
        this.usePaintBucketTool(point);
        break;

      case 'MoveTool':
        if(editor.selection.isActive) {
          //channel.publish('stage.selection.move.pixels', {distance: distance});
          channel.publish('selection.move', {distance: distance});
        }
        else channel.publish('pixels.move', {distance: distance});
        break;
    }

    this.props.editor.pixels.save();
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
        Pixel.add(editor.frame.selected, editor.layers.selected, editor.cursor.position.x, editor.cursor.position.y,
                      file.getLayerById(editor.layers.selected).z, editor.color.brush.hexString());
      }
      else { // restrict to selection
        if(editor.selection.contains(editor.cursor.position)) {
          Pixel.add(editor.frame.selected, editor.layers.selected, editor.cursor.position.x, editor.cursor.position.y,
                        file.getLayerById(editor.layers.selected).z, editor.color.brush.hexString());
        }
      }
    }
  },
  useEraserTool: function() {
    if(isLayerVisible()) {
      if(!editor.selection.isActive) {
        Pixel.delete(editor.frame.selected, editor.layers.selected,
                     editor.cursor.position.x, editor.cursor.position.y,
                     file.getLayerById(editor.layers.selected).z);
      }
      else { // restrict to selection
        if(editor.selection.contains(editor.cursor.position)) {
          Pixel.delete(editor.frame.selected, editor.layers.selected,
                       editor.cursor.position.x, editor.cursor.position.y,
                       file.getLayerById(editor.layers.selected).z);
        }
      }
    }
  },
  useEyedropperTool: function() {
    if(editor.color.frame.alpha() == 0) return; // skip transparent pixels
    channel.publish('app.tool.select', {tool: 'BrushTool'});
    channel.publish('app.color.select', {color: editor.color.frame.hexString()});
  },
  usePaintBucketTool: function(point) {
    if(isLayerVisible()) {
      if(editor.selection.isActive) {
        if(editor.selection.contains(point)) channel.publish('stage.tool.paintbucket', {point: point});
      }
      else channel.publish('stage.tool.paintbucket', {point: point});
    }
  },
  useBrightnessTool: function() {
    if(isLayerVisible()) {

      function lighten() {
        if(editor.color.layer.alpha() == 0) return; // skip transparent pixels
        var newColor = changeColorLightness(editor.color.layer, editor.brightnessTool.intensity);
        Pixel.add(editor.frame.selected, editor.layers.selected, editor.cursor.position.x, editor.cursor.position.y,
              file.getLayerById(editor.layers.selected).z, newColor.hexString());
      };

      function darken() {
        if(editor.color.layer.alpha() == 0) return; // skip transparent pixels
        var newColor = changeColorLightness(editor.color.layer, -editor.brightnessTool.intensity);
        Pixel.add(editor.frame.selected, editor.layers.selected, editor.cursor.position.x, editor.cursor.position.y,
              file.getLayerById(editor.layers.selected).z, newColor.hexString());
      };

      var px = _.findWhere(editor.pixels.layer, {x: editor.cursor.position.x, y: editor.cursor.position.y }),
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
    }
  },
  useMoveTool: function() {
    var distance = this.getMouseDownDistance(),
        canvas = document.getElementById('StageBoxLayer-'+editor.layers.selected),
        canvasPixel;

    editor.pixels.preview = [];

    if(editor.selection.isActive) {

      this.previewRectangularSelection(distance);

      editor.pixels.layer.forEach(function(px) {
        if(editor.selection.contains(px)) canvasPixel = px.wrap(distance, true);
        else canvasPixel = px;
        editor.pixels.preview.push(canvasPixel);
      });
    }
    else {
      editor.pixels.layer.forEach(function(px) {
        canvasPixel = px.wrap(distance, true);
        editor.pixels.preview.push(canvasPixel);
      });
    }

    channel.publish('canvas.preview', {
      frame: editor.frame.selected,
      layer: editor.layers.selected,
    });
  },

  startRectangularSelection: function(point) {
    if(!editor.selection || !editor.selection.contains(point)) {
      channel.publish('selection.clear');
      channel.publish('selection.start', {point: point});
    }
  },
  resizeRectangularSelection: function(point) {
    channel.publish('selection.resize', {point: point});
  },
  previewRectangularSelection: function(distance) {
    channel.publish('selection.preview', {distance: distance});
  },
  endRectangularSelection: function(point, distance) {
    if(editor.selection.isActive) {
      channel.publish('selection.move', {distance: distance});
    }
    else {
      if(_.isEqual(point, this.state.mousedownPoint))
        channel.publish('selection.clear');
      else
        channel.publish('selection.end', {point: point});
    }
  },

});