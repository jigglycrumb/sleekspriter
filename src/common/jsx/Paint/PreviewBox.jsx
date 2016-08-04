var PreviewBox = React.createClass({
  mixins: [FluxMixin, TouchMixin, FoldableMixin],
  getInitialState: function() {
    return {
      animation: null,
    }
  },
  render: function() {

    var handleClasses = {'foldable-handle': true},
        boxStyle = {display: 'block'};

    if(this.props.ui.fold.preview === true) {
      handleClasses['folded'] = true;
      boxStyle.display = 'none';
    }

    var maxWidth = 206,
        maxHeight = 120,
        maxSize,
        preview,
        animation,
        animationToggle = null;

    if(this.props.file.size.width > this.props.file.size.height) {
      // scale to width
      maxSize = maxWidth;
    }
    else {
      // scale to height
      maxSize = maxHeight;
    }

    if(this.state.animation !== null) {
      var leftButtonClasses = {
        left: true,
        transparent: true,
        active: !this.props.ui.settings.animatedPaintPreview,
      };

      var middleButtonClasses = {
        middle: true,
        transparent: true,
        active: this.props.ui.settings.animatedPaintPreview,
      };

      animation = storeUtils.animations.getById(this.state.animation);
      animationToggle =
        <div className="actions paint-preview">
         <button className={classNames(leftButtonClasses)} type="button" title="Preview Frame" onClick={this.handleClick.bind(this, this.previewFrame)} onTouchStart={this.handleTouch.bind(this, this.previewFrame)}>
            <i className="flaticon-man13"></i>
          </button>
          <button className={classNames(middleButtonClasses)} type="button" title="Preview Animation" onClick={this.handleClick.bind(this, this.previewAnimation)} onTouchStart={this.handleTouch.bind(this, this.previewAnimation)}>
            <i className="flaticon-man-silhouette1"></i>
          </button>
          <span className="right">
            <select onChange={this.setAnimation} defaultValue={animation.id}>
              {this.props.file.animations.map(function(animation) {
                return( <option key={animation.id} value={animation.id}>{animation.name}</option> );
              }, this)}
            </select>
          </span>
        </div>;
    }

    if(this.props.ui.settings.animatedPaintPreview === false) {
      preview = <FrameCanvas frame={this.props.ui.frames.selected} file={this.props.file} pixels={this.props.pixels} maxSize={maxSize} noMargin={true} />;
    }
    else if(this.props.ui.settings.animatedPaintPreview === true) {
        preview = <AnimationCanvas
          animation={animation}
          ui={this.props.ui}
          file={this.props.file}
          pixels={this.props.pixels}
          play={true}
          maxSize={maxSize}
          noMargin={true} />;
    }

    return (
      <div id="PreviewBox" className="box">
        <h4 className={classNames(handleClasses)} onClick={this.handleClick.bind(this, this.fold)} onTouchStart={this.handleTouch.bind(this, this.fold)}>Preview</h4>
        <div className="foldable-fold" style={boxStyle}>
          {preview}
          {animationToggle}
        </div>
      </div>
    );
  },

  componentDidMount: function() {
    if(this.props.file.animations.length > 0) {
      this.setState({animation: this.props.file.animations[0].id});
    }
  },

  componentDidUpdate: function() {
    if(this.props.file.animations.length > 0 && this.state.animation === null) {
      this.setState({animation: this.props.file.animations[0].id});
    }
  },

  previewFrame: function() {
    this.getFlux().actions.boxPreviewToggle(false);
  },

  previewAnimation: function() {
    this.getFlux().actions.boxPreviewToggle(true);
  },

  setAnimation: function(event) {
    this.setState({animation: +event.target.value});
  },
});
