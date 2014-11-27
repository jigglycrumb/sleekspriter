var AnimationControlBox = React.createClass({
  render: function() {

    var animation = {
          name: 'none',
          fps: 0,
        },
        listButtonClasses = React.addons.classSet({
          tiny: true,
          transparent: true,
          //active: this.props.editor.settingsVisible,
        }),
        controlButtonClasses = React.addons.classSet({
          tiny: true,
          transparent: true,
        }),
        fpsDisabled = true;

    if(this.props.editor.animations.selected !== null) {
      animation = this.props.editor.animations.getSelected();
      fpsDisabled = false;
    }

    return (
      <div id="AnimationControlBox" className="bar">
        <div>
          <button id="AnimationSelector" className={listButtonClasses} onClick={this.toggleAnimationList} title="Animation list">
            <i className="flaticon-list67"/>
          </button>
          <label>Animation: {animation.name}</label>
        </div>
        <div>
          <label>FPS</label>
          <input type="number" value={animation.fps} onChange={this.setAnimationFps} disabled={fpsDisabled} />
        </div>
        <div>
          <button className={controlButtonClasses} title="Previous frame">
            <i className="flaticon-previous2"/>
          </button>
          <button className={controlButtonClasses} title="Play animation">
            <i className="flaticon-play87"/>
          </button>
          <button className={controlButtonClasses} title="Pause animation">
            <i className="flaticon-small38"/>
          </button>
          <button className={controlButtonClasses} title="Next frame">
            <i className="flaticon-next"/>
          </button>
        </div>
      </div>
    )
  },
  toggleAnimationList: function() {
    channel.publish('animationlist.toggle');
  },
  setAnimationFps: function(event) {
    channel.publish('file.animation.fps', {name: this.props.editor.animations.selected, fps: event.target.value});
  },
});