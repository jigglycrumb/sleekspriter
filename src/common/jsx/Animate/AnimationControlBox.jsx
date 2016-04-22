var AnimationControlBox = React.createClass({
  mixins: [FluxMixin],
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

    if(this.props.ui.animations.playing === true) {
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
          <input type="number" min={1} value={animation.fps} onChange={this.setAnimationFps} disabled={fpsDisabled} />
        </div>
        <div>
          <button className={controlButtonClasses} title="Select previous frame" onClick={this.selectPreviousFrame} disabled={controlsDisabled}>
            <i className="flaticon-previous2"/>
          </button>
          <button className={controlButtonClasses} title="Play animation" onClick={this.playAnimation} disabled={controlsDisabled} style={playButtonStyle}>
            <i className="flaticon-play87"/>
          </button>
          <button className={controlButtonClasses} title="Pause animation" onClick={this.pauseAnimation} disabled={controlsDisabled} style={pauseButtonStyle}>
            <i className="flaticon-small38"/>
          </button>
          <button className={controlButtonClasses} title="Select next frame" onClick={this.selectNextFrame} disabled={controlsDisabled}>
            <i className="flaticon-next"/>
          </button>
        </div>
      </div>
    )
  },
  setAnimationFps: function(event) {
    var fps = +event.target.value;
    this.getFlux().actions.animationFps(this.props.ui.animations.selected, fps);
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
    this.getFlux().actions.animationPlay();
  },
  pauseAnimation: function() {
    this.getFlux().actions.animationPause();
  },
});
