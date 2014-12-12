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
        totalFrames = this.props.editor.file.frames.x * this.props.editor.file.frames.y,
        containerStyle = {width: (frameSize+1)*this.props.editor.file.frames.x},
        buttonDisplay = this.props.editor.animations.selected === null ? 'none' : 'inline-block';
        rowButtonStyle = {top: (this.state.row*(frameSize+1))+20, display: buttonDisplay},
        columnButtonStyle = {left: (this.state.column*(frameSize+1))+20, display: buttonDisplay};

    for(var i=0; i < totalFrames; i++) frames[i] = i+1;

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
    var totalFrames = this.props.editor.file.frames.x * this.props.editor.file.frames.y,
        framesPerRow = this.props.editor.file.frames.x,
        frames = [];
    for(var i = 0; i < totalFrames; i++) {
      var row = Math.floor(i/this.props.editor.file.frames.x);
      if(row === this.state.row) frames.push(i+1);
    }

    var animation = this.props.editor.animations.getSelected();

    frames.forEach(function(frame) {
      var data = {
        animation: this.props.editor.animations.selected,
        frame: frame,
        position: animation.frames.length,
      };

      channel.publish('file.animation.frame.add', data);
    }, this);
  },
  addColumn: function() {
    var totalFrames = this.props.editor.file.frames.x * this.props.editor.file.frames.y,
        framesPerColumn = this.props.editor.file.frames.y,
        frames = [];
    for(var i = 0; i < totalFrames; i++) {
      var column = i % this.props.editor.file.frames.x;
      if(column === this.state.column) frames.push(i+1);
    }

    var animation = this.props.editor.animations.getSelected();

    frames.forEach(function(frame) {
      var data = {
        animation: this.props.editor.animations.selected,
        frame: frame,
        position: animation.frames.length,
      };

      channel.publish('file.animation.frame.add', data);
    }, this);
  },
});