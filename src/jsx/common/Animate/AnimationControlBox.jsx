var AnimationControlBox = React.createClass({
  render: function() {
    return (
      <div id="AnimationControlBox" className="bar">
        <div>
          <select>
            <option>Select an animation...</option>
          </select>
          <button>Edit animations</button>
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