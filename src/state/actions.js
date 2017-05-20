export default {
  selectTool: function(tool) {
    return {
      type: 'SELECT_TOOL',
      tool
    };
  },
};
