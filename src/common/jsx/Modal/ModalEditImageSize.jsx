var ModalEditImageSize = React.createClass({
  mixins: [ModalBasicMixin],
  getInitialState: function() {
    return {
      frames: {
        x: file.frames.x,
        y: file.frames.y,
      },
      pixels: {
        x: file.size.width,
        y: file.size.height,
      },
    }
  },
  render: function() {

    var fileType = this.state.frames.x * this.state.frames.y === 1 ? 'Image' : 'Spritesheet';

    return (
      <div className="dialog">
        <div className="title">Image size</div>
        <div className="text">
          <ul className="frame-size">
            <li>
              <label>Frames:</label>
              <input type="number" ref="framesX" value={this.state.frames.x} min="1" onChange={this.updateForm} />
              x
              <input type="number" ref="framesY" value={this.state.frames.y} min="1" onChange={this.updateForm} />
            </li>
            <li>
              <label>Frame size:</label>
              <input type="number" ref="pixelsX" value={this.state.pixels.x} min="1" onChange={this.updateForm} />
              x
              <input type="number" ref="pixelsY" value={this.state.pixels.y} min="1" onChange={this.updateForm} />
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
          <button onClick={this.updateFile}>Ok</button>
          <button onClick={this.hide}>Cancel</button>
        </div>
      </div>
    )
  },
  updateFile: function() {
    var framesX = +this.refs.framesX.getDOMNode().value,
        framesY = +this.refs.framesY.getDOMNode().value,
        pixelsX = +this.refs.pixelsX.getDOMNode().value,
        pixelsY = +this.refs.pixelsY.getDOMNode().value;

    file.updateDimensions(framesX, framesY, pixelsX, pixelsY);
    this.hide();
  },
  updateForm: function() {
    var size = {
      frames: {
        x: this.refs.framesX.getDOMNode().value,
        y: this.refs.framesY.getDOMNode().value,
      },
      pixels: {
        x: this.refs.pixelsX.getDOMNode().value,
        y: this.refs.pixelsY.getDOMNode().value,
      },
    };
    this.setState(size);
  },
});