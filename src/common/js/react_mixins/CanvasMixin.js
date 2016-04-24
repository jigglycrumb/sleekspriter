var CanvasMixin = {

  componentDidMount: function() {
    this.paint();
  },

  componentDidUpdate: function() {
    switch(stateHistory.last.action) {
      case "CURSOR_SET":
      case "TOOL_SELECT":
      case "SELECTION_CLEAR":
      case "SCOPE_SET":
      case "BRIGHTNESSTOOL_INTENSITY":
      case "BRIGHTNESSTOOL_MODE":
      case "TAB_SELECT":
      case "PALETTE_SELECT":
      case "COLOR_BRUSH":
      case "ANIMATION_ADD":
      case "ANIMATION_SELECT":
      case "ANIMATION_NAME":
      case "ANIMATION_FPS":
      case "ANIMATION_DELETE":
      case "ANIMATION_FRAME_ADD":
      case "MODAL_SHOW":
      case "MODAL_HIDE":
        // no-op
        break;

      case "PIXEL_DELETE":
        this.erasePixel();
        break;

      case "PIXEL_ADD":
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
