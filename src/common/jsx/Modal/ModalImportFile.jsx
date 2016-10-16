var ModalImportFile = React.createClass({
  mixins: [FluxMixin, TouchMixin, ModalBasicMixin],

  frames: {x:  1, y:  1},
  pixels: {x: 10, y: 10},
  zoom: 1,

  getInitialState: function() {
    return {
      image: null,
      imageDataURL: null,
      frames: {x:  1, y:  1},
      pixels: {x: 10, y: 10},
      zoom: 1,
    };
  },
  render: function() {
    var image;

    if(this.state.imageDataURL !== null) {
      image = <img src={this.state.imageDataURL} title={this.state.image.name} ref="importImage" />;
    }
    else {
      image = <h3>Drop image here</h3>;
    }

    return (
      <div className="dialog">
        <div className="title">Import file</div>
        <div className="text">
          <ul>
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
          </ul>
        </div>
        <div className="actions">
          <button onClick={this.handleClick.bind(this, this.import)} onTouchStart={this.handleTouch.bind(this, this.import)}>Ok</button>
          <button onClick={this.handleClick.bind(this, this.hide)} onTouchStart={this.handleTouch.bind(this, this.hide)}>Cancel</button>
        </div>
      </div>
    );
  },

  import: function() {

    // document.getElementById('ScreenBlocker').style.display = 'block';

    // create canvas element
    var canvas = document.createElement('canvas'),
        ctx    = canvas.getContext('2d'),
        image    = this.refs.importImage;

    canvas.width = image.width;
    canvas.height = image.height;

    this.pixels.x = canvas.width;
    this.pixels.y = canvas.height;

    // copy dropped image to canvas
    ctx.drawImage(image, 0, 0);

    // get pixel data
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var json = {
      size: [this.pixels.x, this.pixels.y],
      frames: [this.frames.x, this.frames.y],
      layers: [[1,1,"Layer 1",0,100,1]],
      animations: [],
      pixels: [],
    };

    var layer = 1,
        x = 1,
        y = 1;

    for(var i = 0; i < imageData.data.length; i+=4) {
      var red = imageData.data[i],
          green = imageData.data[i+1],
          blue = imageData.data[i+2],
          alpha = 1; //1-(imageData.data[i+2]/255);

      // if(alpha !== 0) {
        var pixel = [layer, x, y, red, green, blue, alpha];
        json.pixels.push(pixel);
      // }

      if(x == canvas.width) {
        x = 1;
        y++;
      }
      else x++;
    }

    // document.getElementById('ScreenBlocker').style.display = 'none';

    this.hide();
    platformUtils.loadFromJSON(json);
    this.getFlux().actions.frameSelect(1);
    this.getFlux().actions.layerSelect(1);

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
          console.log(file);
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
