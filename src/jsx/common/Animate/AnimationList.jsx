var AnimationList = React.createClass({
  mixins: [PostalSubscriptionMixin],
  getInitialState: function() {
    return {
      visible: false,
      addButtonDisabled: true,
      subscriptions: {
        'animationlist.toggle': this.toggleDisplay,
      },
    }
  },
  render: function() {
    var style = {
      display: this.state.visible === true ? 'block' : 'none'
    };

    return (
      <div id="AnimationList" style={style}>
        <h4>Available animations</h4>
        <ul className="animations">
        {this.props.animations.map(function(animation) {
          return (
            <li key={animation.name} className="animation">
              <span className="name">{animation.name}</span>
              <button onClick={this.deleteAnimation.bind(this, animation.name)}>&times;</button>
            </li>
          )
        }, this)}
        </ul>
        <div className="new">
          <input ref="name" type="text" placeholder="Enter new animation name" onKeyUp={this.checkReturn} onInput={this.checkName} onPaste={this.checkName} />
          <button ref="addButton" onClick={this.createAnimation} disabled={this.state.addButtonDisabled}>+</button>
        </div>
      </div>
    )
  },
  checkReturn: function(event) {
    if(event.nativeEvent.keyCode === 13) this.createAnimation();
  },
  checkName: function(event) {
    var name = this.refs.name.getDOMNode().value,
        buttonDisabled = name.length === 0 ? true : false;
    this.setState({addButtonDisabled: buttonDisabled});
  },
  createAnimation: function() {
    var name = this.refs.name.getDOMNode().value;
    if(name.length === 0) return; // the button should be disabled by now, but as we learned in zombieland: double tap.

    // check if there's already an animation with the same name
    var oldAnimation = _.find(this.props.animations, function(animation) {
      return animation.name === name;
    });

    if(_.isUndefined(oldAnimation)) {
      // todo: make the fps configurable, somehow.
      channel.publish('file.animation.add', {name: name, fps: 10});
      this.refs.name.getDOMNode().value = '';
      this.setState({addButtonDisabled: true});
    }
  },
  deleteAnimation: function(name) {
    channel.publish('file.animation.delete', {name: name});
  },
  toggleDisplay: function() {
    this.setState({visible: !this.state.visible});
  },
});