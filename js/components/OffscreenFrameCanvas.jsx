/** @jsx React.DOM */
var OffscreenFrameCanvas = React.createClass({
  propTypes: {
    frame: React.PropTypes.number.isRequired
  },
  getInitialState: function() {
    return {
      needsRefresh: false,
    };
  },
  render: function() {
    return (
      <canvas
        id={this.props.key}
        className="OffscreenFrameCanvas"
        width={this.props.editor.size.width}
        height={this.props.editor.size.height}
        style={{
          width: this.props.editor.size.width,
          height: this.props.editor.size.height
        }}
      ></canvas>
    );
  },
  componentDidMount: function() {
    //this.subscription = channel.subscribe('stage.layer.update', this.prepareRefresh);
    /*
    this.subscriptions = [
      channel.subscribe('app.frame.select', this.prepareRefresh),
      channel.subscribe('file.layer.opacity.select', this.prepareRefresh),
      channel.subscribe('file.layer.visibility.toggle', this.prepareRefresh),
      channel.subscribe('stage.layer.update', this.prepareRefresh),
      channel.subscribe('app.pixel.select', this.getPixelColor),
    ];
    */

  },
  componentWillUnmount: function() {
    this.subscription.unsubscribe();
  },
  componentDidUpdate: function() {
    //console.log('update, state: ', this.state);
    if(this.state.needsRefresh && (this.props.frame == this.props.editor.frame)) {
      this.getDOMNode().width = this.getDOMNode().width;
      var self = this;
      for(var i = this.props.editor.layers.frame.length -1; i >= 0; i--) {
        var layer = this.props.editor.layers.frame[i];
        if(layer.visible) {
          var sourceCanvas = document.getElementById('StageBoxLayer-'+layer.id);
          var ctx = self.getDOMNode().getContext('2d');
          ctx.globalAlpha = layer.opacity/100;
          ctx.drawImage(sourceCanvas, 0, 0, this.props.editor.size.width, this.props.editor.size.height);
        }
      }
      //channel.publish('stage.frame.update', {frame: this.props.frame});
    }
  },
  prepareRefresh: function(data) {
    if(this.props.frame == this.props.editor.frame) {
      this.setState({needsRefresh: true});
    }
  },
  getPixelColor: function(data) {
    if(this.props.frame == this.props.editor.frame) {
      var ctx = this.getDOMNode().getContext('2d'),
          px = ctx.getImageData(data.point.x-1, data.point.y-1, 1, 1).data,
          color = Color({r:px[0], g:px[1], b:px[2], a:px[3]});

      editor.pixelColor = color;
    }
  }
});