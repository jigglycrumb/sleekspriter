var ScreenPaint = React.createClass({
  getInitialState: function() {
    return {
      referenceImage: null,
      referenceImageDataURL: null,
    };
  },
  shouldComponentUpdate: function() {
    switch(stateHistory.last.action) {
      case 'EXPORT_PART':
      case 'EXPORT_FRAME':
      case 'EXPORT_ANIMATION':
      case 'EXPORT_ZOOM':
      case 'EXPORT_FORMAT':
      case 'EXPORT_STATUS':
        return false;

      default:
        return true;
    }
  },

  render: function() {
    var frameBox = null;
    if(this.props.ui.frames.total > 1) frameBox = <FrameBox file={this.props.file} ui={this.props.ui} pixels={this.props.pixels} fold="frames" />;

    var referenceImage = null;
    if(this.state.referenceImageDataURL !== null) referenceImage = <ReferenceImage image={this.state.referenceImage} imageData={this.state.referenceImageDataURL} removeHandler={this.resetImage} />;

    return (
      <section className="screen paint">
        <div className="area top">
          <ToolContainer ui={this.props.ui} file={this.props.file} />
        </div>
        <div className="area left">
          <ToolBox ui={this.props.ui} />
        </div>
        <div className="area center" onDragOver={this.cancel} onDrop={this.handleDrop}>
          <StageBox image={this.state.referenceImage} file={this.props.file} ui={this.props.ui} pixels={this.props.pixels} />
          {referenceImage}
        </div>
        <div className="area right">
          <div id="layerboxhelper">
            <PreviewBox file={this.props.file} ui={this.props.ui} pixels={this.props.pixels} fold="preview" />
            {frameBox}
          </div>
          <LayerBox file={this.props.file} ui={this.props.ui} pixels={this.props.pixels} fold="layers" />
        </div>
        <div className="area statusbar">
          <StatusBar ui={this.props.ui} pixels={this.props.pixels} />
        </div>
      </section>
    );
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
            self.setState({referenceImage: file, referenceImageDataURL: e.target.result});
          };
        })(file);

        reader.readAsDataURL(file);
      }
    }
  },

  resetImage: function() {
    this.setState({referenceImage: null, referenceImageDataURL: null});
  },
});
