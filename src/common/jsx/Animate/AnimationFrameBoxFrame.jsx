var AnimationFrameBoxFrame = React.createClass({
  render: function() {

    var id = 'AnimationFrameBoxFrame-'+this.props.frame,
        classes = classNames({
          'frame': true,
          'top': this.props.frame <= this.props.editor.frames.x,
          'right': this.props.frame % this.props.editor.frames.x == 0,
          'bottom': this.props.frame > this.props.editor.frames.total - this.props.editor.frames.x,
          'left': (this.props.frame-1) % this.props.editor.frames.x == 0,
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
        <FrameCanvas
          id={this.props.frame}
          width={this.props.editor.file.size.width}
          height={this.props.editor.file.size.height}
          size={this.props.size} />
        <label>{this.props.frame}</label>
      </div>
    );
  },

  dragStart: function(event) {
    if(this.props.editor.animations.selected === null) return;
    event.dataTransfer.setData('frame', this.props.frame);
  },

  select: function() {
    if(this.props.editor.animations.selected === null) return;
    this.getDOMNode().classList.add('selected');
    var row = Math.floor((this.props.frame-1)/this.props.editor.frames.x),
        column = (this.props.frame % this.props.editor.frames.x === 0
               ? this.props.editor.frames.x : this.props.frame%this.props.editor.frames.x)-1;

    channel.gui.publish('animation.framebox.frame.select', {row: row, column: column});
  },

  unselect: function() {
    if(this.props.editor.animations.selected === null) return;
    this.getDOMNode().classList.remove('selected');
  },
});