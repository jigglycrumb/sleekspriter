var AnimationFrameBoxFrame = React.createClass({
  render: function() {

    var id = 'AnimationFrameBoxFrame-'+this.props.frame,
        classes = classNames({
          'frame': true,
          'top': this.props.frame <= this.props.file.frames.x,
          'right': this.props.frame % this.props.file.frames.x == 0,
          'bottom': this.props.frame > this.props.ui.frames.total - this.props.file.frames.x,
          'left': (this.props.frame-1) % this.props.file.frames.x == 0,
        });

    return (
      <div
          id={id} 
          className={classes}
          draggable="true"
          onDragStart={this.dragStart}
          onMouseEnter={this.props.onMouseEnterHandler} 
          onMouseLeave={this.props.onMouseLeaveHandler}
      >

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