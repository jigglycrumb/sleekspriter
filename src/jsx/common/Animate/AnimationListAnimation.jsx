var AnimationListAnimation = React.createClass({
  render: function() {
    var cssClasses = React.addons.classSet({
      animation: true,
      selected: this.props.selected,
    });

    return (
      <li className={cssClasses}>
        <input className="select" type="radio" name="animation" value={this.props.animation.name} checked={this.props.selected} onChange={this.dispatchAnimationSelected} />
        <NameEditable name={this.props.animation.name} callback={this.dispatchAnimationNameChanged.bind(this, this.props.animation.name)} />
        <span className="fps">{this.props.animation.fps}</span>
        <span className="frames">{this.props.animation.frames.length === 0 ? '-' : this.props.animation.frames.length}</span>
      </li>
    )
  },
  dispatchAnimationSelected: function() {
    channel.publish('animation.select', {name: this.props.animation.name});
  },
  dispatchAnimationNameChanged: function(oldName, newName) {
    channel.publish('file.animation.rename', {oldName: oldName, newName: newName});
  },
});