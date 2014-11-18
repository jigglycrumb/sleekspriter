var AnimationFrameBoxFrame = React.createClass({
  render: function() {

    var totalFrames = this.props.editor.file.frames.x * this.props.editor.file.frames.y;
        id = 'AnimationFrameBoxFrame-'+this.props.frame,
        classes = React.addons.classSet({
          'frame': true,
          'top': this.props.frame <= this.props.editor.file.frames.x,
          'right': this.props.frame % this.props.editor.file.frames.x == 0,
          'bottom': this.props.frame > totalFrames - this.props.editor.file.frames.x,
          'left': (this.props.frame-1) % this.props.editor.file.frames.x == 0,
        });

    return (
      <div
        id={id} 
        className={classes}
        draggable="true"
        onDragStart={this.dragStart}
        onMouseEnter={this.select}
        onMouseLeave={this.unselect}
      >
        <AnimationFrameBoxFrameCanvas
          id={this.props.frame}
          width={this.props.editor.file.size.width}
          height={this.props.editor.file.size.height}
          size={this.props.size} />
        <label>{this.props.frame}</label>
      </div>
    );
  },

  dragStart: function(event) {
    event.dataTransfer.setData('frame', this.props.frame);
  },

  select: function() {
    this.getDOMNode().classList.add('selected');
  },

  unselect: function() {
    this.getDOMNode().classList.remove('selected');
  },
});