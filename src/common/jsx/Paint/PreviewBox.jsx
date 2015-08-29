var PreviewBox = React.createClass({
  mixins: [FoldableMixin],
  render: function() {

    var scale = 1,
        maxWidth = 160,
        maxHeight = 90;

    if(this.props.file.size.width > this.props.file.size.height) {
      // scale to width
      scale = Math.floor(maxWidth/this.props.file.size.width);
    }
    else {
      // scale to height
      scale = Math.floor(maxHeight/this.props.file.size.height);
    }

    return (
      <div id="PreviewBox" className="box">
        <h4 className="foldable-handle">Preview</h4>
        <div className="foldable-fold">
          <FrameCanvas frame={this.props.ui.frames.selected} file={this.props.file} pixels={this.props.pixels} zoom={scale} />
        </div>
      </div>
    );
  },

  // getPixelColor: function(position) {
  //   var scale = this.getScale(),
  //       ctx   = this.getDOMNode().getContext('2d'),
  //       x     = position.x-1,
  //       y     = position.y-1,
  //       px    = ctx.getImageData(x*scale, y*scale, 1, 1).data,
  //       color = new Color({r:px[0], g:px[1], b:px[2], a:px[3]});

  //   //this.getFlux().actions.colorFrame(color.hexString());
  // },
  // getScale: function() {
  //   var scale = 1,
  //       maxWidth = 160,
  //       maxHeight = 90;

  //   if(this.props.width > this.props.height) {
  //     // scale to width
  //     scale = maxWidth/this.props.width;
  //   }
  //   else {
  //     // scale to height
  //     scale = maxHeight/this.props.height;
  //   }

  //   return Math.floor(scale);
  // },
});