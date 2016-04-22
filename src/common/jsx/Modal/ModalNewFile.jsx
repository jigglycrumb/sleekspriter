var ModalNewFile = React.createClass({
  mixins: [FluxMixin, ModalBasicMixin],
  getInitialState: function() {
    return {
      frames: {x:  2, y:  2},
      pixels: {x: 200, y: 200},
    }
  },
  render: function() {

    var fileType = this.state.frames.x * this.state.frames.y === 1 ? 'Image' : 'Spritesheet';

    return (
      <div className="dialog">
        <div className="title">New file</div>
        <div className="text">
          <ul className="frame-size">
            <li>
              <label>Frames:</label>
              <input type="number" ref="framesX" value={this.state.frames.x} min="1" onChange={this.updateState} />
              x
              <input type="number" ref="framesY" value={this.state.frames.y} min="1" onChange={this.updateState} />
            </li>
            <li>
              <label>Frame size:</label>
              <input type="number" ref="pixelsX" value={this.state.pixels.x} min="1" onChange={this.updateState} />
              x
              <input type="number" ref="pixelsY" value={this.state.pixels.y} min="1" onChange={this.updateState} />
              px
            </li>
            <li>
              <i ref="size">{fileType} size: {this.state.frames.x*this.state.pixels.x}x{this.state.frames.y*this.state.pixels.y} pixels</i>
            </li>
          </ul>
          <div>
            <span>Layout</span>
            <FrameGrid frames={this.state.frames} />
          </div>
        </div>
        <div className="actions">
          <button onClick={this.createFile}>Ok</button>
          <button onClick={this.hide}>Cancel</button>
        </div>
      </div>
    )
  },
  createFile: function() {
    this.getFlux().actions.fileCreate(this.state.frames.x, this.state.frames.y, this.state.pixels.x, this.state.pixels.y);
    this.getFlux().actions.frameSelect(1);
    this.getFlux().actions.layerSelect(1);
    this.hide();
  },
  updateState: function() {
    var size = {
      frames: {
        x: this.refs.framesX.value,
        y: this.refs.framesY.value,
      },
      pixels: {
        x: this.refs.pixelsX.value,
        y: this.refs.pixelsY.value,
      },
    };
    this.setState(size);
  },
});
