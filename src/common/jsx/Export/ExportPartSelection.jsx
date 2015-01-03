var ExportPartSelection = React.createClass({
  getInitialState: function() {
    return {
      part: 'spritesheet',
      frame: 1,
      animation: null,
    }
  },
  render: function() {

    var parts = [
      {name: 'spritesheet', el: 'Spritesheet as single image'},
      {name: 'allframes', el: 'Every frame as single image'},
      {name: 'oneframe', el:  <span>
                                Frame&nbsp;
                                <input type="number" value={this.state.frame} min={1} max={this.props.editor.frames.total} onChange={this.setFrame} />
                                &nbsp;/&nbsp;
                                {this.props.editor.frames.total} as image
                              </span>},
      {name: 'animation', el: <span>
                                Animation&nbsp;
                                <select onChange={this.setAnimation}>
                                  {this.props.editor.animations.list.map(function(animation) {
                                    <option value={animation.name}>{animation.name}</option>
                                  }, this)}
                                </select>
                              </span>},
    ];

    return (
      <div>
        <h6>What to export</h6>
        <ul>
          {parts.map(function(part) {
            var checked = part.name === this.state.part ? true : false;
            return (
              <li key={part.name}>
                <label>
                  <input type="radio" name="export-part" value={part.name} onChange={this.setPart} checked={checked} />
                  {part.el}
                </label>
              </li>
            );
          }, this)}
        </ul>
      </div>
    )
  },
  setPart: function(event) {
    this.setState({part: event.target.value});
    channel.publish('export.part.set', {part: event.target.value});
  },
  setAnimation: function(event) {
    this.setState({animation: event.target.value});
    channel.publish('export.animation.set', {animation: event.target.value});
  },
  setFrame: function(event) {
    this.setState({frame: +event.target.value});
    channel.publish('export.frame.set', {frame: +event.target.value});
  },
});