export default {
  selectTool: function(tool) {
    return {
      type: 'SELECT_TOOL',
      tool
    };
  },
  selectZoom: function(zoom) {
    return {
      type: 'SELECT_ZOOM',
      zoom
    }
  },
  toggleGrid: function() {
    return {
      type: 'TOGGLE_GRID'
    }
  },
  zoomIn: function() {
    return {
      type: 'ZOOM_IN'
    }
  },
  zoomOut: function() {
    return {
      type: 'ZOOM_OUT'
    }
  },
  zoomFit: function(fileSize) {
    return {
      type: 'ZOOM_FIT',
      fileSize
    }
  },
};
