var AnimationList = React.createClass({
  getInitialState: function() {
    return {
      addButtonDisabled: true,
    }
  },
  render: function() {
    return (
      <div id="AnimationList">
        <h4>Available animations</h4>
        <ul className="animations">
        {this.props.animations.map(function(animation) {
          return (
            <li key={animation.name} className="animation">
              <input type="radio" name="animation" value={animation.name} onClick={this.selectAnimation} />
              <NameEditable name={animation.name} callback={this.dispatchAnimationNameChanged.bind(this, animation.name)} />
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
  selectAnimation: function(event) {
    channel.publish('animation.select', {name: event.target.value});
  },
  dispatchAnimationNameChanged: function(oldName, newName) {
    channel.publish('file.animation.rename', {oldName: oldName, newName: newName});
  },
});