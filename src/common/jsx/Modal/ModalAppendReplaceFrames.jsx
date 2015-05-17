var ModalAppendReplaceFrames = React.createClass({
  mixins: [ModalBasicMixin],
  render: function() {
    return (
      <div className="dialog">
        <div className="title">Decision needed</div>
        <div className="text">Append frames to animation or replace existing frames?</div>
        <div className="actions">
          <button onClick={this.appendFrames}>Append</button>
          <button onClick={this.replaceFrames}>Replace</button>
          <button onClick={this.hide}>Cancel</button>
        </div>
      </div>
    )
  },
  appendFrames: function() {
    var animation = this.props.editor.animations.getSelected();
    this.props.data.frames.forEach(function(frame) {
      var data = {
        animation: this.props.editor.animations.selected,
        frame: frame,
        position: animation.frames.length,
      };
      channel.file.publish('animation.frame.add', data);
    }, this);

    this.hide();
  },
  replaceFrames: function() {
    channel.file.publish('animation.frames.empty', {animation: this.props.editor.animations.selected});
    this.appendFrames();
  }
});