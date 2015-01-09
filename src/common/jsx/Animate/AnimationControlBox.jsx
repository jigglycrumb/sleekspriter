var AnimationControlBox = React.createClass({
  mixins: [PostalSubscriptionMixin, SelectedAnimationFrameMixin],
  getInitialState: function() {
    return {
      animationInterval: null,
    }
  },
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
        controlsDisabled = true,
        playButtonStyle = {
          display: 'inline-block'
        },
        pauseButtonStyle = {
          display: 'none'
        };

    if(this.props.animations.selected !== null) {
      animation = this.props.animations.getSelected();
      fpsDisabled = false;
      if(animation.frames.length > 1) {
        controlsDisabled = false;
      }
    }

    if(this.state.animationInterval !== null) {
      playButtonStyle.display = 'none';
      pauseButtonStyle.display = 'inline-block';
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
          <button className={controlButtonClasses} title="Play animation" onClick={this.playAnimation} disabled={controlsDisabled} style={playButtonStyle}>
            <i className="flaticon-play87"/>
          </button>
          <button className={controlButtonClasses} title="Pause animation" onClick={this.pauseAnimation} disabled={controlsDisabled} style={pauseButtonStyle}>
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
    var fps = +event.target.value;
    channel.publish('file.animation.fps', {name: this.props.animations.selected, fps: fps});
    if(this.state.animationInterval !== null) this.adjustAnimationFps(fps);
  },
  selectFrame: function(data) {
    this.setState({selectedFrame: data.position});
  },
  selectNextFrame: function() {
    var animation = this.props.animations.getSelected(),
        frame = this.state.selectedFrame;
    frame++;
    if(frame > animation.frames.length - 1) frame = 0;

    var data = {
      frame: animation.frames[frame],
      position: frame,
      scroll: true,
    };

    channel.publish('animation.frame.select', data);
  },
  selectPreviousFrame: function() {
    var animation = this.props.animations.getSelected(),
        frame = this.state.selectedFrame;
    frame--;
    if(frame < 0) frame = animation.frames.length - 1;

    var data = {
      frame: animation.frames[frame],
      position: frame,
      scroll: true,
    };

    channel.publish('animation.frame.select', data);
  },
  playAnimation: function() {
    if(this.state.animationInterval === null) {
      var animation = this.props.animations.getSelected(),
          ms = 1000/animation.fps,
          interval = setInterval(this.selectNextFrame, ms);
      this.setState({animationInterval: interval});
    }
  },
  pauseAnimation: function() {
    if(this.state.animationInterval !== null) {
      clearInterval(this.state.animationInterval);
      this.setState({animationInterval: null});
    }
  },
  adjustAnimationFps: function(fps) {
      var ms = 1000/fps;
      clearInterval(this.state.animationInterval);
      interval = setInterval(this.selectNextFrame, ms);
      this.setState({animationInterval: interval});
  },
});