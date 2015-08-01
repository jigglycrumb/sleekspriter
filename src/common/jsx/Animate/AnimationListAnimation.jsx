var AnimationListAnimation = React.createClass({
  mixins: [FluxMixin],
  render: function() {
    var cssClasses = classNames({
      animation: true,
      selected: this.props.selected,
    });

    return (
      <li className={cssClasses}>
        <input className="select" type="radio" name="animation" value={this.props.animation.id} checked={this.props.selected} onChange={this.dispatchAnimationSelected} />
        <NameEditable name={this.props.animation.name} callback={this.dispatchAnimationNameChanged.bind(this, this.props.animation.id)} />
        <span className="fps">{this.props.animation.fps}</span>
        <span className="frames">{this.props.animation.frames.length === 0 ? '-' : this.props.animation.frames.length}</span>
      </li>
    )
  },
  dispatchAnimationSelected: function() {
    this.getFlux().actions.animationSelect(this.props.animation.id);

    if(this.props.animation.frames.length > 0) {
      channel.gui.publish('animation.frame.select', {
        frame: this.props.animation.frames[0],
        position: 0,
      });
    }
  },
  dispatchAnimationNameChanged: function(animation, newName) {
    this.getFlux().actions.animationName(animation, newName);
  },
});