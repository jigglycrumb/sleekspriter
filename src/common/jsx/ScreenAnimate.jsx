var ScreenAnimate = React.createClass({
  mixins: [PostalSubscriptionMixin],
  getInitialState: function() {
    return {
      listVisible: false,
      subscriptions: {
        'animationlist.toggle': this.toggleAnimationList,
      },
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
          <AnimationFrameBox ui={this.props.ui} file={this.props.file} editor={this.props.editor} />
        </div>

        <div className="area right">
          <AnimationPreviewBox ui={this.props.ui} file={this.props.file} editor={this.props.editor} />
        </div>

        <div className="area center">
          <AnimationTimelineBox ui={this.props.ui} file={this.props.file} editor={this.props.editor} listVisible={this.state.listVisible} />
        </div>

        <div className="area statusbar">
          <AnimationControlBox animations={this.props.editor.animations} listVisible={this.state.listVisible} />
        </div>

        <AnimationList animations={this.props.editor.animations} listVisible={this.state.listVisible} />
      </section>
    )
  },
  toggleAnimationList: function() {
    this.setState({listVisible: !this.state.listVisible});
  },
});