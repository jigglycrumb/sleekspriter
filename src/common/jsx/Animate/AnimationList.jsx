var AnimationList = React.createClass({
  render: function() {

    var deleteButtonDisabled = this.props.animations.list.length === 0 || this.props.animations.selected === null
                             ? true : false,
        animations = _.sortBy(this.props.animations.list, 'name');

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
          var selected = animation.name === this.props.animations.selected ? true : false;
          return (
            <AnimationListAnimation key={animation.name} animation={animation} selected={selected} />
          )
        }, this)}
        </ul>

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
  dispatchAnimationAdded: function() {
    channel.file.publish('file.animation.add');
  },
  dispatchAnimationRemoved: function() {
    channel.file.publish('file.animation.delete', {name: this.props.animations.selected});
  },
});