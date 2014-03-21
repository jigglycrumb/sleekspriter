var FrameBoxFrame = React.createClass({
  render: function() {
    var cssClass = 'FrameBoxFrame';
    if(this.props.frame == editor.frame) cssClass+= ' selected';
    return (
      <canvas
        id={this.props.key}
        data-frame={this.props.frame}
        className={cssClass}
        style={{width: this.props.size, height: this.props.size}}
        onClick={this.dispatchFrameSelected}
      />
    );
  },
  dispatchFrameSelected: function() {
    this.props.signal.frameSelected.dispatch(this.props.frame);
  }
});