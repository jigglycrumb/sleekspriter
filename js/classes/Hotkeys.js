var Hotkeys = function(editor) {

  this.actions = {
    selectBrushTool: {
      key: 'b',
      action: function() { channel.publish('app.tool.select', {tool: 'BrushTool'}); }
    },
    selectEraserTool: {
      key: 'e',
      action: function() { channel.publish('app.tool.select', {tool: 'EraserTool'}); }
    },
    selectEyedropperTool: {
      key: 'i',
      action: function() { channel.publish('app.tool.select', {tool: 'EyedropperTool'}); }
    },
    selectRectangularSelectionTool: {
      key: 'm',
      action: function() { channel.publish('app.tool.select', {tool: 'RectangularSelectionTool'}); }
    },
    selectPaintBucketTool: {
      key: 'p',
      action: function() { channel.publish('app.tool.select', {tool: 'PaintBucketTool'}); }
    },
    selectBrightnessTool: {
      key: 'o',
      action: function() { channel.publish('app.tool.select', {tool: 'BrightnessTool'}); }
    },
    selectMoveTool: {
      key: 'v',
      action: function() { channel.publish('app.tool.select', {tool: 'MoveTool'}); }
    },
    selectZoomTool: {
      key: 'z',
      action: function() { channel.publish('app.tool.select', {tool: 'ZoomTool'}); }
    },
    toggleGrid: {
      key: 'g',
      action: function() { channel.publish('stage.grid.toggle', {grid: !editor.grid.enabled}); }
    },
    dropSelection: {
      key: ['ctrl+d', 'command+d'],
      action: function() { channel.publish('stage.selection.clear'); }
    },









    arrowUp: {
      key: ['up'],
      action: function() {

        var distance = new Point(0, -1);

        switch(editor.tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = changeColorLightness(editor.color.brush, 1);
            channel.publish('app.color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) channel.publish('stage.selection.move.bounds', {distance: distance});
            break;
          case 'BrightnessTool':
            var intensity = editor.brightnessTool.intensity+1;
            if(intensity <= 100) channel.publish('app.brightnesstool.intensity.select', {intensity: intensity});
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              channel.publish('stage.selection.move.pixels', {distance: distance});
              channel.publish('stage.selection.move.bounds', {distance: distance});
            }
            else channel.publish('stage.tool.move', {distance: distance});
            stage.layer.refresh();
            break;
          case 'ZoomTool':
            var zoom = editor.zoom.current+1;
            if(zoom <= 50) channel.publish('stage.zoom.select', {zoom: zoom});
            break;
        }
      }
    },
    arrowRight: {
      key: ['right'],
      action: function() {

        var distance = new Point(1, 0);

        switch(editor.tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = editor.color.brush.rotate(1);
            channel.publish('app.color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) channel.publish('stage.selection.move.bounds', {distance: distance});
            break;
          case 'BrightnessTool':
            channel.publish('app.brightnesstool.mode.select', {mode: 'darken'});
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              channel.publish('stage.selection.move.pixels', {distance: distance});
              channel.publish('stage.selection.move.bounds', {distance: distance});
            }
            else channel.publish('stage.tool.move', {distance: distance});
            stage.layer.refresh();
            break;
          case 'ZoomTool':
            var zoom = editor.zoom.current+1;
            if(zoom <= 50) channel.publish('stage.zoom.select', {zoom: zoom});
            break;
        }
      }
    },
    arrowDown: {
      key: ['down'],
      action: function() {

        var distance = new Point(0, 1);

        switch(editor.tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = changeColorLightness(editor.color.brush, -1);
            channel.publish('app.color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) channel.publish('stage.selection.move.bounds', {distance: distance});
            break;
          case 'BrightnessTool':
            var intensity = editor.brightnessTool.intensity-1;
            if(intensity >= 1) channel.publish('app.brightnesstool.intensity.select', {intensity: intensity});
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              channel.publish('stage.selection.move.pixels', {distance: distance});
              channel.publish('stage.selection.move.bounds', {distance: distance});
            }
            else channel.publish('stage.tool.move', {distance: distance});
            stage.layer.refresh();
            break;
          case 'ZoomTool':
            var zoom = editor.zoom.current-1;
            if(zoom >= 1) channel.publish('stage.zoom.select', {zoom: zoom});
            break;
        }
      }
    },
    arrowLeft: {
      key: ['left'],
      action: function() {

        var distance = new Point(-1, 0);

        switch(editor.tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = editor.color.brush.rotate(-1);
            channel.publish('app.color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) channel.publish('stage.selection.move.bounds', {distance: distance});
            break;
          case 'BrightnessTool':
            channel.publish('app.brightnesstool.mode.select', {mode: 'lighten'});
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              channel.publish('stage.selection.move.pixels', {distance: distance});
              channel.publish('stage.selection.move.bounds', {distance: distance});
            }
            else channel.publish('stage.tool.move', {distance: distance});
            stage.layer.refresh();
            break;
          case 'ZoomTool':
            var zoom = editor.zoom.current-1;
            if(zoom >= 1) channel.publish('stage.zoom.select', {zoom: zoom});
            break;
        }
      }
    },









    shiftArrowUp: {
      key: ['shift+up'],
      action: function() {
        var distance = new Point(0, -10);
        switch(editor.tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = changeColorLightness(editor.color.brush, 10);
            channel.publish('app.color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) channel.publish('stage.selection.move.bounds', {distance: distance});
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              channel.publish('stage.selection.move.pixels', {distance: distance});
              channel.publish('stage.selection.move.bounds', {distance: distance});
            }
            else channel.publish('stage.tool.move', {distance: distance});
            stage.layer.refresh();
            break;
        }
      }
    },
    shiftArrowRight: {
      key: ['shift+right'],
      action: function() {
        var distance = new Point(10, 0);
        switch(editor.tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = editor.color.brush.rotate(10);
            channel.publish('app.color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) channel.publish('stage.selection.move.bounds', {distance: distance});
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              channel.publish('stage.selection.move.pixels', {distance: distance});
              channel.publish('stage.selection.move.bounds', {distance: distance});
            }
            else channel.publish('stage.tool.move', {distance: distance});
            stage.layer.refresh();
            break;
        }
      }
    },
    shiftArrowDown: {
      key: ['shift+down'],
      action: function() {
        var distance = new Point(0, 10);
        switch(editor.tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = changeColorLightness(editor.color.brush, -10);
            channel.publish('app.color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) channel.publish('stage.selection.move.bounds', {distance: distance});
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              channel.publish('stage.selection.move.pixels', {distance: distance});
              channel.publish('stage.selection.move.bounds', {distance: distance});
            }
            else channel.publish('stage.tool.move', {distance: distance});
            stage.layer.refresh();
            break;
        }
      }
    },
    shiftArrowLeft: {
      key: ['shift+left'],
      action: function() {
        var distance = new Point(-10, 0);
        switch(editor.tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = editor.color.brush.rotate(-10);
            channel.publish('app.color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) channel.publish('stage.selection.move.bounds', {distance: distance});
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              channel.publish('stage.selection.move.pixels', {distance: distance});
              channel.publish('stage.selection.move.bounds', {distance: distance});
            }
            else channel.publish('stage.tool.move', {distance: distance});
            stage.layer.refresh();
            break;
        }
      }
    },
  };

  var self = this;

  Object.keys(this.actions).map(function(action) {
    var a = self.actions[action];
    Mousetrap.bind(a.key, a.action);
  });
};