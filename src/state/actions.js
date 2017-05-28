export default {
  selectTool: function(tool) {
    return {
      type: 'SELECT_TOOL',
      tool
    };
  },
  toggleGrid: function() {
    return {
      type: 'TOGGLE_GRID'
    }
  },
};
