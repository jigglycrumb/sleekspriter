var FrameBoxFrame = React.createClass({
  mixins:[CopyFrameMixin],
  render: function() {
    var cssClass = 'FrameBoxFrame';
    if(this.props.frame == this.props.editor.frame) cssClass+= ' selected';
    if(this.props.frame%this.props.io.frames.x == 0) cssClass+= ' right';
    if(this.props.frame<=this.props.io.frames.x) cssClass+= ' top';

    return (
      <canvas
        id={this.props.key}
        data-frame={this.props.frame}
        className={cssClass}
        width={this.props.io.size.width*this.props.editor.zoom}
        height={this.props.io.size.height*this.props.editor.zoom}
        style={{
          width: this.props.size,
          height: this.props.size
        }}
        onClick={this.dispatchFrameSelected}/>
    );
  },
  dispatchFrameSelected: function() {
    this.props.signal.frameSelected.dispatch(this.props.frame);
  }
});