var AnimationList = React.createClass({
  getInitialState: function() {
    return {
      addButtonDisabled: true,
    }
  },
  render: function() {

    var disabled = this.props.animations.length <= 1 ? true : false;

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
        {this.props.animations.map(function(animation) {
          return (
            <li key={animation.name} className="animation">
              <input className="select" type="radio" name="animation" value={animation.name} onClick={this.selectAnimation} />
              <NameEditable name={animation.name} callback={this.dispatchAnimationNameChanged.bind(this, animation.name)} />
              <span className="fps">{animation.fps}</span>
              <span className="frames">{animation.frames.length}</span>
            </li>
          )
        }, this)}
        </ul>

        <div className="animations-footer">
          {/*
          <label className="select">&nbsp;</label>
          <input ref="name" type="text" placeholder="Enter new animation name" onKeyUp={this.checkReturn} onInput={this.checkName} onPaste={this.checkName} />
          <button ref="addButton" onClick={this.createAnimation} disabled={this.state.addButtonDisabled}>+</button>
          */}
          <button title="New animation" className="tiny transparent"><i className="flaticon-plus25"></i></button>
          <button title="Delete selected animation" className="tiny transparent" disabled={disabled}><i className="flaticon-minus18"></i></button>
        </div>
      </div>
    )
  },
  checkReturn: function(event) {
    if(event.keyCode === 13) this.createAnimation();
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