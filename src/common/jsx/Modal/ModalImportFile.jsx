var ModalImportFile = React.createClass({
  mixins: [FluxMixin, TouchMixin, ModalBasicMixin],

  getInitialState: function() {
    return {
      image: {
        width: 0,
        height: 0,
        name: null,
        data: null,
      },
      frames: {
        x: 1,
        y: 1,
      },
      zoom: 1,
    };
  },
  render: function() {
    var content;

    if(this.state.image.data !== null) {
      var wrapperCss = {
        width: this.state.image.width,
        height: this.state.image.height
      };

      content = <div>
                  <div className="image-import-dropzone-wrapper" style={wrapperCss}>
                    <img src={this.state.image.data} title={this.state.image.name} ref="importImage" />
                    <GridCanvas
                      width={this.state.image.width}
                      height={this.state.image.height}
                      columns={this.state.frames.x}
                      rows={this.state.frames.y} />
                  </div>
                  <ul>
                    <li>
                      <label>Frames:</label>
                      <input type="number" ref="framesX" value={this.state.frames.x} min="1" onChange={this.updateFrames} />
                      x
                      <input type="number" ref="framesY" value={this.state.frames.y} min="1" onChange={this.updateFrames} />
                    </li>
                    <li>
                      <label>Frame size:</label>
                      {this.state.image.width/this.state.frames.x}x{this.state.image.height/this.state.frames.y}px
                    </li>
                  </ul>
                </div>;
    }
    else {
      content = <h3>Drop image here</h3>;
    }

    return (
      <div className="dialog">
        <div className="title">Import file</div>
        <div className="text">
          <div id="image-import-dropzone" onDragOver={this.cancel} onDrop={this.handleDrop}>
            {content}
          </div>
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

    // this.pixels.x = canvas.width;
    // this.pixels.y = canvas.height;

    // copy dropped image to canvas
    ctx.drawImage(image, 0, 0);

    // get pixel data
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var json = {
      size: [this.state.pixels.x, this.state.pixels.y],
      frames: [this.state.frames.x, this.state.frames.y],
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
          return function(e) {
            var data = e.target.result,
                dummy = document.createElement('img');

            dummy.src = data;

            self.setState({
              image: {
                width: dummy.width,
                height: dummy.height,
                name: file.name,
                data: data,
              }
            });

            delete dummy;
          };
        })(file);
        reader.readAsDataURL(file);
      }
    }
  },

  resetImage: function() {
    this.setState({image: this.getInitialState().image});
  },

  updateFrames: function() {
    this.setState({
      frames: {
        x: +this.refs.framesX.value,
        y: +this.refs.framesY.value,
      }
    });
  },
});
