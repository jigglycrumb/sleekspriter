var CanvasMixin = {

  componentDidMount: function() {
    this.paint();
  },

  componentDidUpdate: function() {
    switch(stateHistory.last.action) {
      case constants.TOOL_SELECT:
      case constants.SELECTION_CLEAR:
      case constants.SCOPE_SET:
      case constants.BRIGHTNESSTOOL_INTENSITY:
      case constants.BRIGHTNESSTOOL_MODE:
      case constants.TAB_SELECT:
      case constants.PALETTE_SELECT:
      case constants.COLOR_BRUSH:
      case constants.ANIMATION_ADD:
      case constants.ANIMATION_SELECT:
      case constants.ANIMATION_NAME:
      case constants.ANIMATION_FPS:
      case constants.ANIMATION_DELETE:
      case constants.ANIMATION_FRAME_ADD:
      case constants.MODAL_SHOW:
      case constants.MODAL_HIDE:
      // case "PIXELS_ADD":
        // no-op
        break;

      case constants.PIXEL_DELETE:
        this.erasePixel();
        break;

      case constants.PIXEL_ADD:
        this.paintPixel();
        break;

      default:
        this.paint();
        break;
    }
  },

  fitToSize: function(size, noMargin) {

    var w = this.props.file.size.width,
        h = this.props.file.size.height,
        style = {},
        scale;

    if(w > h) scale = size/w;
    else scale = size/h;

    if(scale > 1) scale = Math.floor(scale);

    w = Math.round(w*scale);
    h = Math.round(h*scale);

    if(!noMargin) {
      style.marginTop = Math.round((size - h)/2 || 0);
      style.marginLeft = Math.round((size - w)/2 || 0);
    }

    return {
      size: {
        width: w,
        height: h,
      },
      style: style
    };
  },

  clear: function() {
    var canvas = ReactDOM.findDOMNode(this);
    canvas.width = canvas.width;
  },
};
