var AnimationList = React.createClass({
  mixins: [FluxMixin],
  render: function() {

    var deleteButtonDisabled = this.props.file.animations.length === 0 || this.props.ui.animations.selected === null
                             ? true : false,
        animations = _.sortBy(this.props.file.animations, 'name'),
        helpingHand = null;

    if(this.props.file.animations.length === 0 && this.props.listVisible === true) {
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
          var selected = animation.id === this.props.ui.animations.selected ? true : false;
          return (
            <AnimationListAnimation key={animation.id} animation={animation} selected={selected} />
          )
        }, this)}
        </ul>

        {helpingHand}

        <div className="animations-footer">
          <button title="New animation" className="transparent" onClick={this.dispatchAnimationAdded} onTouchStart={this.dispatchAnimationAdded}>
            <i className="flaticon-plus25" />
          </button>
          <button title="Delete selected animation" className="transparent" onClick={this.dispatchAnimationRemoved} onTouchStart={this.dispatchAnimationRemoved} disabled={deleteButtonDisabled}>
            <i className="flaticon-minus18" />
          </button>
        </div>
      </div>
    )
  },
  dispatchAnimationAdded: function() {
    this.getFlux().actions.animationAdd();
  },
  dispatchAnimationRemoved: function() {
    this.getFlux().actions.animationDelete(this.props.ui.animations.selected);
  },
});
