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
    var content,
        okButtonDisabled = true;

    if(this.state.image.data !== null) {
      var wrapperCss = {
        width: this.state.image.width,
        height: this.state.image.height
      };

      var s = this.calculateFrameSize(),
          frameWidth = s.width,
          frameHeight = s.height,
          frameSize,
          validation = this.validateFrameSize();

      if(validation.allValid) {
        okButtonDisabled = false;
        frameSize = <span>{frameWidth} x {frameHeight} px</span>;
      }
      else {
        var w = validation.widthValid ? frameWidth : <span className="error">{frameWidth.toFixed(1)}</span>,
            h = validation.heightValid ? frameHeight : <span className="error">{frameHeight.toFixed(1)}</span>;

        frameSize = <span>{w} x {h} px</span>;
      }

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
                      <label>Frame size:</label> {frameSize}
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
          <button onClick={this.handleClick.bind(this, this.import)} onTouchStart={this.handleTouch.bind(this, this.import)} disabled={okButtonDisabled}>Ok</button>
          <button onClick={this.handleClick.bind(this, this.hide)} onTouchStart={this.handleTouch.bind(this, this.hide)}>Cancel</button>
        </div>
      </div>
    );
  },

  import: function() {

    if(this.validateFrameSize().allValid) {
      // document.getElementById('ScreenBlocker').style.display = 'block';

      // create canvas element
      var canvas = document.createElement('canvas'),
          ctx    = canvas.getContext('2d'),
          image    = this.refs.importImage;

      canvas.width = image.width;
      canvas.height = image.height;

      // copy dropped image to canvas
      ctx.drawImage(image, 0, 0);

      // get pixel data
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      var frameSize = this.calculateFrameSize();

      var json = {
        size: [frameSize.width, frameSize.height],
        frames: [this.state.frames.x, this.state.frames.y],
        layers: [],
        animations: [],
        pixels: [],
      };

      // create layers
      var totalFrames = this.state.frames.x * this.state.frames.y;
      for(var i = 1; i <= totalFrames; i++) {
        json.layers.push([i,i,"Layer "+i,0,100,1]);
      }

      var frame = 1, // will also serve as layer id
      position = {
        canvas: { x: 1, y: 1 },
        frame: { x: 1, y: 1 }
      };

      // loop over image data and create pixels
      for(var i = 0; i < imageData.data.length; i+=4) {
        var red = imageData.data[i],
            green = imageData.data[i+1],
            blue = imageData.data[i+2],
            alpha = (imageData.data[i+3]/255).toFixed(2);

        if(alpha > 0) {
          var pixel = [frame, position.frame.x, position.frame.y, red, green, blue, alpha];
          json.pixels.push(pixel);
        }

        if(position.frame.x == frameSize.width) {
          frame++;
          position.frame.x = 1;
        }
        else {
          position.frame.x++;
        }

        if(position.canvas.x == canvas.width) {
          var row = Math.floor(position.canvas.y/(canvas.height/this.state.frames.y));

          frame = 1 + (this.state.frames.x * row);

          position.frame.x = 1;

          if(position.canvas.y%(canvas.height/this.state.frames.y) === 0) {
            position.frame.y = 1;
          }
          else {
            position.frame.y++;
          }

          position.canvas.x = 1;
          position.canvas.y++;
        }
        else {
          position.canvas.x++;
        }
      }

      // document.getElementById('ScreenBlocker').style.display = 'none';

      console.log(json);

      platformUtils.loadFromJSON(json);
      this.getFlux().actions.frameSelect(1);
      this.getFlux().actions.layerSelect(1);
      this.hide();
    }
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

  calculateFrameSize: function() {
    return {
      width: this.state.image.width/this.state.frames.x,
      height: this.state.image.height/this.state.frames.y
    }
  },

  validateFrameSize: function() {
    var s = this.calculateFrameSize(),
        widthValid = s.width === parseInt(s.width, 10),
        heightValid = s.height === parseInt(s.height, 10);

    return {
      widthValid: widthValid,
      heightValid: heightValid,
      allValid: widthValid && heightValid
    }
  },
});
