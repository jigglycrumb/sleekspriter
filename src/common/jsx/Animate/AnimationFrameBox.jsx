var AnimationFrameBox = React.createClass({
  mixins: [FluxMixin],
  getInitialState: function() {
    return {
      row: 0,
      column: 0,
    }
  },
  render: function() {
    var frames = [], // array for mapping the frame components
        frameSize = 100,
        containerStyle = {width: (frameSize+1)*this.props.file.frames.x},
        buttonDisplay = this.props.ui.animations.selected === null ? 'none' : 'inline-block';
        rowButtonStyle = {top: (this.state.row*(frameSize+5))+24, display: buttonDisplay},
        columnButtonStyle = {left: (this.state.column*frameSize)+this.state.column+24, display: buttonDisplay},
        classes = {};

    for(var i=0; i < this.props.ui.frames.total; i++) frames[i] = i+1;

    if(this.props.ui.animations.selected !== null) classes['animation-selected'] = true;

    return (
      <div id="AnimationFrameBox" className={classNames(classes)}>
        <h5>Frames</h5>
        <div className="scroller">
          <div className="inner" style={containerStyle}>
          <button className="mass-add row" title="Add row to animation" style={rowButtonStyle} onClick={this.addRow}>+</button>
          <button className="mass-add column" title="Add column to animation" style={columnButtonStyle} onClick={this.addColumn}>+</button>
          {frames.map(function(frame) {
            return (
              <AnimationFrameBoxFrame
                key={frame} 
                frame={frame} 
                size={frameSize}
                ui={this.props.ui} 
                file={this.props.file}
                pixels={this.props.pixels}
                onMouseEnterHandler={this.selectFrame.bind(this, frame)} />
            );
          }, this)}
          </div>
        </div>
      </div>
    );
  },
  selectFrame: function(frame) {
    if(this.props.ui.animations.selected === null) return;
    var row = Math.floor((frame-1)/this.props.file.frames.x),
        column = (frame % this.props.file.frames.x === 0
               ? this.props.file.frames.x : frame%this.props.file.frames.x)-1;

    this.setState({row: row, column: column});
  },
  addRow: function() {
    var frames = [];

    for(var i = 0; i < this.props.ui.frames.total; i++) {
      var row = Math.floor(i/this.props.file.frames.x);
      if(row === this.state.row) frames.push(i+1);
    }

    this.getFlux().actions.modalShow(ModalAppendReplaceFrames, {frames: frames});
  },
  addColumn: function() {
    var frames = [];

    for(var i = 0; i < this.props.ui.frames.total; i++) {
      var column = i % this.props.file.frames.x;
      if(column === this.state.column) frames.push(i+1);
    }

    this.getFlux().actions.modalShow(ModalAppendReplaceFrames, {frames: frames});
  },
});