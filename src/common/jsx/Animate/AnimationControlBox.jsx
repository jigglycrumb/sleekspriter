// Flux: done, editor: done
var AnimationControlBox = React.createClass({
  mixins: [FluxMixin],
  getInitialState: function() {
    return {
      animationInterval: null,
      scroll: false,
    }
  },
  render: function() {
    var animation = {
          name: 'none',
          fps: 0,
        },
        listButtonClasses = classNames({
          transparent: true,
          list: true,
          active: this.props.listVisible,
        }),
        controlButtonClasses = classNames({
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

    if(this.props.ui.animations.selected !== null) {
      animation = storeUtils.animations.getSelected();
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
          <button className={listButtonClasses} onClick={this.props.toggleAnimationList} title="Animation list">
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
  setAnimationFps: function(event) {
    var fps = +event.target.value;
    this.getFlux().actions.animationFps(this.props.ui.animations.selected, fps);
    if(this.state.animationInterval !== null) this.adjustAnimationFps(fps);
  },
  selectNextFrame: function() {
    var animation = storeUtils.animations.getSelected(),
        frame = this.props.ui.animations.frame;
    frame++;
    if(frame > animation.frames.length - 1) frame = 0;

    this.getFlux().actions.animationFrameSelect(frame);
  },
  selectPreviousFrame: function() {
    var animation = storeUtils.animations.getSelected(),
        frame = this.props.ui.animations.frame;
    frame--;
    if(frame < 0) frame = animation.frames.length - 1;

    this.getFlux().actions.animationFrameSelect(frame);
  },
  playAnimation: function() {
    if(this.state.animationInterval === null) {
      var animation = storeUtils.animations.getSelected(),
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