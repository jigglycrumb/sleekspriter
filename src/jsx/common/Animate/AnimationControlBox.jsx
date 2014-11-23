var AnimationControlBox = React.createClass({
  render: function() {
    return (
      <div id="AnimationControlBox" className="bar">
        <div>
          <button id="AnimationSelector">
            <span>Select an animation</span>
          </button>
        </div>
        <div>
          <label>FPS</label>
          <input id="AnimationFpsInput" type="number" defaultValue="10" />
        </div>
        <div>
          <button>prev</button>
          <button>play</button>
          <button>pause</button>
          <button>next</button>
        </div>
      </div>
    )
  }
});