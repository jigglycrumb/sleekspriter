var Hotkeys = function(signal) {

  var actions = {
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
    }
  };

  Object.keys(actions).map(function(action) {
    var a = actions[action];
    Mousetrap.bind(a.key, a.action);
  });
};

var hotkeys = new Hotkeys(signal);