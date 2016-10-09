var ModalImportFile = React.createClass({
  mixins: [FluxMixin, TouchMixin, ModalBasicMixin],
  getInitialState: function() {
    return {
      image: null,
      imageDataURL: null,
      frames: {x:  1, y:  1},
      pixels: {x: 10, y: 10},
    };
  },
  render: function() {

    var fileType = this.state.frames.x * this.state.frames.y === 1 ? 'Image' : 'Spritesheet';

    var image;
    if(this.state.imageDataURL !== null) {
      image = <img src={this.state.imageDataURL} title={this.state.image.name} />;
    }
    else {
      image = <h3>Drop image here</h3>;
    }

    return (
      <div className="dialog">
        <div className="title">Import file</div>
        <div className="text">
          <ul className="frame-size">
            <li>
              <div id="image-import-dropzone" onDragOver={this.cancel} onDrop={this.handleDrop}>
                {image}
              </div>
            </li>
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
          <button onClick={this.handleClick.bind(this, this.createFile)} onTouchStart={this.handleTouch.bind(this, this.createFile)}>Ok</button>
          <button onClick={this.handleClick.bind(this, this.hide)} onTouchStart={this.handleTouch.bind(this, this.hide)}>Cancel</button>
        </div>
      </div>
    );
  },
  createFile: function() {
    this.hide();
    this.getFlux().actions.fileCreate(this.state.frames.x, this.state.frames.y, this.state.pixels.x, this.state.pixels.y);
    this.getFlux().actions.frameSelect(1);
    this.getFlux().actions.layerSelect(1);
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

  cancel: function(e) {
    e.stopPropagation();
    e.preventDefault();
  },

  handleDrop: function(e) {
    this.cancel(e);

    if(e.dataTransfer.files.length >= 1) {
      var file = e.dataTransfer.files[0],
          allowed = {
            'image/jpeg': true,
            'image/gif': true,
            'image/png': true,
          };

      var self = this;

      if(file.type in allowed) {
        var reader = new FileReader();

        reader.onload = (function(theFile) {
          return function(e) {
            self.setState({image: file, imageDataURL: e.target.result});
          };
        })(file);

        reader.readAsDataURL(file);
      }
    }
  },

  resetImage: function() {
    this.setState({image: null, imageDataURL: null});
  },
});
