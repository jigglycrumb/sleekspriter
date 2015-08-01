var AnimationList = React.createClass({
  mixins: [PostalSubscriptionMixin],
  getInitialState: function() {
    return {
      shouldSelectAnimation: false,
      subscriptions: {
        'animation.add': this.shouldSelectAnimation,
        'animation.delete': this.shouldSelectAnimation,
      }
    }
  },
  render: function() {

    var deleteButtonDisabled = this.props.animations.length === 0 || this.props.selected === null
                             ? true : false,
        animations = _.sortBy(this.props.animations, 'name'),
        helpingHand = null;

    if(this.props.animations.length === 0 && this.props.listVisible === true) {
      helpingHand = <div className="helping-hand"><i className="flaticon-hand118"></i></div>
    }

    return (
      <div id="AnimationList">
        <h5>Available animations</h5>

        <h4 className="animations-header">
          <label className="select"><i className="flaticon-film50" /></label>
          <label className="name">Name</label>
          <label className="fps">FPS</label>
          <label className="frames">Frames</label>
        </h4>

        <ul className="animations">
        {animations.map(function(animation) {
          var selected = animation.id === this.props.selected ? true : false;
          return (
            <AnimationListAnimation key={animation.id} animation={animation} selected={selected} />
          )
        }, this)}
        </ul>

        {helpingHand}

        <div className="animations-footer">
          <button title="New animation" className="transparent" onClick={this.dispatchAnimationAdded}>
            <i className="flaticon-plus25" />
          </button>
          <button title="Delete selected animation" className="transparent" onClick={this.dispatchAnimationRemoved} disabled={deleteButtonDisabled}>
            <i className="flaticon-minus18" />
          </button>
        </div>
      </div>
    )
  },
  componentDidUpdate: function() {
    if(this.state.shouldSelectAnimation !== false) {
      channel.gui.publish('animation.select', {name: this.state.shouldSelectAnimation});
      this.setState({ shouldSelectAnimation: false });
    }
  },
  dispatchAnimationAdded: function() {
    channel.file.publish('animation.add');
  },
  dispatchAnimationRemoved: function() {
    channel.file.publish('animation.delete', {name: this.props.animations.selected});
  },
  shouldSelectAnimation: function(data) {
    if(data.name !== null) this.setState({ shouldSelectAnimation: data.name });
  },
});