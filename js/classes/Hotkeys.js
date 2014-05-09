var Hotkeys = function(signal, editor) {

  this.actions = {
    selectBrushTool: {
      key: 'b',
      action: function() { signal.toolSelected.dispatch('BrushTool'); }
    },
    selectEraserTool: {
      key: 'e',
      action: function() { signal.toolSelected.dispatch('EraserTool'); }
    },
    selectEyedropperTool: {
      key: 'i',
      action: function() { signal.toolSelected.dispatch('EyedropperTool'); }
    },
    selectRectangularSelectionTool: {
      key: 'm',
      action: function() { signal.toolSelected.dispatch('RectangularSelectionTool'); }
    },
    selectPaintBucketTool: {
      key: 'p',
      action: function() { signal.toolSelected.dispatch('PaintBucketTool'); }
    },
    selectBrightnessTool: {
      key: 'o',
      action: function() { signal.toolSelected.dispatch('BrightnessTool'); }
    },
    selectMoveTool: {
      key: 'v',
      action: function() { signal.toolSelected.dispatch('MoveTool'); }
    },
    selectZoomTool: {
      key: 'z',
      action: function() { signal.toolSelected.dispatch('ZoomTool'); }
    },
    toggleGrid: {
      key: 'g',
      action: function() { signal.gridToggled.dispatch(!editor.grid); }
    },
    dropSelection: {
      key: ['ctrl+d', 'command+d'],
      action: function() { signal.selectionCleared.dispatch(); }
    },









    arrowUp: {
      key: ['up'],
      action: function() {

        var distance = new Point(0, -1);

        switch(editor.tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = changeColorLightness(editor.color, 1);
            signal.colorSelected.dispatch(color.rgbString());
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) signal.selectionMoved.dispatch(distance);
            break;
          case 'BrightnessTool':
            var intensity = editor.brightnessToolIntensity+1;
            if(intensity <= 100) signal.brightnessToolIntensityChanged.dispatch(intensity);
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              signal.selectionPixelsMoved.dispatch(distance);
              signal.selectionMoved.dispatch(distance);
            }
            else signal.pixelsMoved.dispatch(distance);
            stage.layer.refresh();
            break;
          case 'ZoomTool':
            var zoom = editor.zoom+1;
            if(zoom <= 50) signal.zoomChanged.dispatch(zoom);
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
            var color = editor.color.rotate(1);
            signal.colorSelected.dispatch(color.rgbString());
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) signal.selectionMoved.dispatch(distance);
            break;
          case 'BrightnessTool':
            signal.brightnessToolModeChanged.dispatch('darken');
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              signal.selectionPixelsMoved.dispatch(distance);
              signal.selectionMoved.dispatch(distance);
            }
            else signal.pixelsMoved.dispatch(distance);
            stage.layer.refresh();
            break;
          case 'ZoomTool':
            var zoom = editor.zoom+1;
            if(zoom <= 50) signal.zoomChanged.dispatch(zoom);
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
            var color = changeColorLightness(editor.color, -1);
            signal.colorSelected.dispatch(color.rgbString());
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) signal.selectionMoved.dispatch(distance);
            break;
          case 'BrightnessTool':
            var intensity = editor.brightnessToolIntensity-1;
            if(intensity >= 1) signal.brightnessToolIntensityChanged.dispatch(intensity);
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              signal.selectionPixelsMoved.dispatch(distance);
              signal.selectionMoved.dispatch(distance);
            }
            else signal.pixelsMoved.dispatch(distance);
            stage.layer.refresh();
            break;
          case 'ZoomTool':
            var zoom = editor.zoom-1;
            if(zoom >= 1) signal.zoomChanged.dispatch(zoom);
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
            var color = editor.color.rotate(-1);
            signal.colorSelected.dispatch(color.rgbString());
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) signal.selectionMoved.dispatch(distance);
            break;
          case 'BrightnessTool':
            signal.brightnessToolModeChanged.dispatch('lighten');
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              signal.selectionPixelsMoved.dispatch(distance);
              signal.selectionMoved.dispatch(distance);
            }
            else signal.pixelsMoved.dispatch(distance);
            stage.layer.refresh();
            break;
          case 'ZoomTool':
            var zoom = editor.zoom-1;
            if(zoom >= 1) signal.zoomChanged.dispatch(zoom);
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
            var color = changeColorLightness(editor.color, 10);
            signal.colorSelected.dispatch(color.rgbString());
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) signal.selectionMoved.dispatch(distance);
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              signal.selectionPixelsMoved.dispatch(distance);
              signal.selectionMoved.dispatch(distance);
            }
            else signal.pixelsMoved.dispatch(distance);
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
            var color = editor.color.rotate(10);
            signal.colorSelected.dispatch(color.rgbString());
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) signal.selectionMoved.dispatch(distance);
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              signal.selectionPixelsMoved.dispatch(distance);
              signal.selectionMoved.dispatch(distance);
            }
            else signal.pixelsMoved.dispatch(distance);
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
            var color = changeColorLightness(editor.color, -10);
            signal.colorSelected.dispatch(color.rgbString());
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) signal.selectionMoved.dispatch(distance);
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              signal.selectionPixelsMoved.dispatch(distance);
              signal.selectionMoved.dispatch(distance);
            }
            else signal.pixelsMoved.dispatch(distance);
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
            var color = editor.color.rotate(-10);
            signal.colorSelected.dispatch(color.rgbString());
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) signal.selectionMoved.dispatch(distance);
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              signal.selectionPixelsMoved.dispatch(distance);
              signal.selectionMoved.dispatch(distance);
            }
            else signal.pixelsMoved.dispatch(distance);
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