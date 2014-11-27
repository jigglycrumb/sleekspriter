var AnimationControlBox = React.createClass({
  render: function() {

    var animationName = this.props.editor.animations.selected === null ? 'none' : this.props.editor.animations.selected,
        listButtonClasses = React.addons.classSet({
          tiny: true,
          transparent: true,
          //active: this.props.editor.settingsVisible,
        }),
        controlButtonClasses = React.addons.classSet({
          tiny: true,
          transparent: true,
        });



    return (
      <div id="AnimationControlBox" className="bar">
        <div>
          <button id="AnimationSelector" className={listButtonClasses} onClick={this.toggleAnimations} title="Animation list">
            <i className="flaticon-list67"/>
          </button>
          <label>Animation: {animationName}</label>
        </div>
        <div>
          <label>FPS</label>
          <input id="AnimationFpsInput" type="number" defaultValue="10" />
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
  toggleAnimations: function() {
    channel.publish('animationlist.toggle');
  },
});