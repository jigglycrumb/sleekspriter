var StageBoxCanvasMixin = {
  clear: function() {
    var canvas = ReactDOM.findDOMNode(this);
    canvas.width = canvas.width;
  },
};

module.exports = StageBoxCanvasMixin;
