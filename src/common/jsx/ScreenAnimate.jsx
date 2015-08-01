// Flux: done, editor: done
var ScreenAnimate = React.createClass({
  getInitialState: function() {
    return {
      listVisible: false,
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
          <AnimationFrameBox ui={this.props.ui} file={this.props.file} />
        </div>

        <div className="area right">
          <AnimationPreviewBox ui={this.props.ui} file={this.props.file} />
        </div>

        <div className="area center">
          <AnimationTimelineBox
            ui={this.props.ui}
            file={this.props.file}
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
    )
  },
  toggleAnimationList: function() {
    this.setState({listVisible: !this.state.listVisible});
  },
});