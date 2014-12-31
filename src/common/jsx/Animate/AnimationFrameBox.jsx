var AnimationFrameBox = React.createClass({
  mixins: [PostalSubscriptionMixin],
  getInitialState: function() {
    return {
      row: 0,
      column: 0,
      subscriptions: {
        'animation.framebox.frame.select': this.selectFrame,
      },
    }
  },
  render: function() {
    var frames = [], // array for mapping the frame components
        frameSize = 100,
        containerStyle = {width: (frameSize+1)*this.props.editor.frames.x},
        buttonDisplay = this.props.editor.animations.selected === null ? 'none' : 'inline-block';
        rowButtonStyle = {top: (this.state.row*(frameSize+1))+20, display: buttonDisplay},
        columnButtonStyle = {left: (this.state.column*(frameSize+1))+20, display: buttonDisplay};

    for(var i=0; i < this.props.editor.frames.total; i++) frames[i] = i+1;

    return (
      <div id="AnimationFrameBox">
        <h5>Frames</h5>
        <div className="scroller">
          <div className="inner" style={containerStyle}>
          <button className="mass-add row" title="Add row to animation" style={rowButtonStyle} onClick={this.addRow}>+</button>
          <button className="mass-add column" title="Add column to animation" style={columnButtonStyle} onClick={this.addColumn}>+</button>
          {frames.map(function(frame) {
            return (
              <AnimationFrameBoxFrame key={frame} frame={frame} size={frameSize} editor={this.props.editor} />
            );
          }, this)}
          </div>
        </div>
      </div>
    );
  },
  selectFrame: function(data) {
    this.setState(data);
  },
  addRow: function() {
    var frames = [];

    for(var i = 0; i < this.props.editor.frames.total; i++) {
      var row = Math.floor(i/this.props.editor.frames.x);
      if(row === this.state.row) frames.push(i+1);
    }

    channel.publish('modal.show', {component: ModalAppendReplaceFrames, frames: frames});
  },
  addColumn: function() {
    var frames = [];

    for(var i = 0; i < this.props.editor.frames.total; i++) {
      var column = i % this.props.editor.frames.x;
      if(column === this.state.column) frames.push(i+1);
    }

    channel.publish('modal.show', {component: ModalAppendReplaceFrames, frames: frames});
  },
});