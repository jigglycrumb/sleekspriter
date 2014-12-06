var AnimationControlBox = React.createClass({
  mixins: [PostalSubscriptionMixin, SelectedAnimationFrameMixin],
  render: function() {
    var animation = {
          name: 'none',
          fps: 0,
        },
        listButtonClasses = React.addons.classSet({
          transparent: true,
          list: true,
          active: this.props.listVisible,
        }),
        controlButtonClasses = React.addons.classSet({
          transparent: true,
        }),
        fpsDisabled = true,
        controlsDisabled = true;

    if(this.props.animations.selected !== null) {
      animation = this.props.animations.getSelected();
      fpsDisabled = false;

      if(animation.frames.length > 1) {
        controlsDisabled = false;
      }
    }

    return (
      <div id="AnimationControlBox" className="bar">
        <div>
          <button className={listButtonClasses} onClick={this.toggleAnimationList} title="Animation list">
            <i className="flaticon-list67"/>
          </button>
          <label>Animation: {animation.name}</label>
        </div>
        <div>
          <label>FPS</label>
          <input type="number" value={animation.fps} onChange={this.setAnimationFps} disabled={fpsDisabled} />
        </div>
        <div>
          <button className={controlButtonClasses} title="Previous frame" onClick={this.selectPreviousFrame} disabled={controlsDisabled}>
            <i className="flaticon-previous2"/>
          </button>
          <button className={controlButtonClasses} title="Play animation" disabled={controlsDisabled}>
            <i className="flaticon-play87"/>
          </button>
          <button className={controlButtonClasses} title="Pause animation" disabled={controlsDisabled}>
            <i className="flaticon-small38"/>
          </button>
          <button className={controlButtonClasses} title="Next frame" onClick={this.selectNextFrame} disabled={controlsDisabled}>
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
    channel.publish('file.animation.fps', {name: this.props.animations.selected, fps: event.target.value});
  },
  selectNextFrame: function() {
    if(this.props.animations.selected !== null) {
      var animation = this.props.animations.getSelected(),
          frame = this.state.selectedFrame;
      frame++;
      if(frame > animation.frames.length - 1) frame = 0;

      var data = {
        frame: animation.frames[frame],
        position: frame,
      };

      channel.publish('animation.frame.select', data);
    }
  },
  selectPreviousFrame: function() {
    if(this.props.animations.selected !== null) {
      var animation = this.props.animations.getSelected(),
          frame = this.state.selectedFrame;
      frame--;
      if(frame < 0) frame = animation.frames.length - 1;

      var data = {
        frame: animation.frames[frame],
        position: frame,
      };

      channel.publish('animation.frame.select', data);
    }
  },
});