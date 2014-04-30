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
        console.log('key up', editor.tool);

        switch(editor.tool) {
          case 'BrightnessTool':
            var intensity = editor.brightnessToolIntensity+1;
            if(intensity <= 100) signal.brightnessToolIntensityChanged.dispatch(intensity);
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
        console.log('key right', editor.tool);

        switch(editor.tool) {
          case 'BrightnessTool':
            signal.brightnessToolModeChanged.dispatch('darken');
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
        console.log('key down', editor.tool);

        switch(editor.tool) {
          case 'BrightnessTool':
            var intensity = editor.brightnessToolIntensity-1;
            if(intensity >= 1) signal.brightnessToolIntensityChanged.dispatch(intensity);
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
        console.log('key left', editor.tool);

        switch(editor.tool) {
          case 'BrightnessTool':
            signal.brightnessToolModeChanged.dispatch('lighten');
            break;
          case 'ZoomTool':
            var zoom = editor.zoom-1;
            if(zoom >= 1) signal.zoomChanged.dispatch(zoom);
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

var hotkeys = new Hotkeys(signal, editor);