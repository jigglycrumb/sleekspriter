var AnimationFrameBoxFrame = React.createClass({
  render: function() {

    var id = 'AnimationFrameBoxFrame-'+this.props.frame;

    return (
      <div
          id={id} 
          className="frame"
          draggable="true"
          onDragStart={this.dragStart}
          onMouseEnter={this.props.onMouseEnterHandler} 
          onMouseLeave={this.props.onMouseLeaveHandler}>

        <FrameCanvas frame={this.props.frame} file={this.props.file} pixels={this.props.pixels} maxSize={this.props.size} />
        <label>{this.props.frame}</label>
      </div>
    );
  },

  dragStart: function(event) {
    if(this.props.ui.animations.selected === null) return;
    event.dataTransfer.setData('frame', this.props.frame);
  },
});