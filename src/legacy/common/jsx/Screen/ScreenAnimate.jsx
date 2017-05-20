var ScreenAnimate = React.createClass({
  getInitialState: function() {
    return {
      listVisible: false,
    };
  },
  shouldComponentUpdate: function() {
    switch(stateHistory.last.action) {
      case 'TOOL_SELECT':
      case 'SETTINGS_GRID':
      case 'ZOOM_SELECT':
      case 'FRAME_SELECT':
      case 'BRIGHTNESSTOOL_MODE':
      case 'BRIGHTNESSTOOL_INTENSITY':
      case 'COLOR_BRUSH':
      case 'PALETTE_SELECT':
      case 'LAYER_SELECT':
      case 'LAYER_TOP_SELECT':
      case 'BOX_FOLD':
      case 'BOX_PREVIEW_TOGGLE':
      case 'ONION_TOGGLE':
      case 'ONION_MODE':
      case 'ONION_FRAME':
      case 'SELECTION_START':
      case 'SELECTION_RESIZE':
      case 'SELECTION_PREVIEW':
      case 'SELECTION_END':
      case 'SELECTION_CLEAR':
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

    var cssClasses = classNames({
      'screen': true,
      'animate': true,
      'list-visible': this.state.listVisible,
    });

    return (
      <section className={cssClasses}>
        <div className="area left">
          <AnimationFrameBox ui={this.props.ui} file={this.props.file} pixels={this.props.pixels} />
        </div>

        <div className="area right">
          <AnimationPreviewBox ui={this.props.ui} file={this.props.file} pixels={this.props.pixels} />
        </div>

        <div className="area center">
          <AnimationTimelineBox
            ui={this.props.ui}
            file={this.props.file}
            pixels={this.props.pixels}
            listVisible={this.state.listVisible} />
        </div>

        <div className="area statusbar">
          <AnimationControlBox
            ui={this.props.ui}
            listVisible={this.state.listVisible}
            toggleAnimationList={this.toggleAnimationList} />
        </div>

        <AnimationList
          ui={this.props.ui}
          file={this.props.file}
          listVisible={this.state.listVisible} />
      </section>
    );
  },
  toggleAnimationList: function() {
    this.setState({listVisible: !this.state.listVisible});
  },
});
