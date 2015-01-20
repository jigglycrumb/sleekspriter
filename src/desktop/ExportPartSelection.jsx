var ExportPartSelection = React.createClass({
  render: function() {
    var parts = [
      {name: 'spritesheet', el: 'Spritesheet as single image'},
      {name: 'oneframe', el:  <span>
                                Frame&nbsp;
                                <input type="number" value={this.props.frame} min={1} max={this.props.editor.frames.total} onChange={this.setFrame} />
                                &nbsp;/&nbsp;
                                {this.props.editor.frames.total} as image
                              </span>},
      {name: 'allframes', el: 'Every frame as single image'},
    ];

    if(this.props.editor.animations.list.length > 0) {

      var name = this.props.animation === null ? this.props.editor.animations.list[0].name : this.props.animation,
          animation = this.props.editor.animations.getByName(name),
          runtime = Math.round(1000/animation.fps * animation.frames.length);

      parts.push({
        name: 'animation',
        el: <span>
              Animation&nbsp;
              <select onChange={this.setAnimation} defaultValue={name}>
                {this.props.editor.animations.list.map(function(animation) {
                  return( <option key={animation.name} value={animation.name}>{animation.name}</option> )
                }, this)}
              </select>
              <i className="animation-info">
                {animation.frames.length} frames, {animation.fps} fps<br />
                Runtime: {runtime} ms
              </i>
            </span>
      });
    }

    return (
      <div>
        <h6>Export</h6>
        <ul>
          {parts.map(function(part) {
            var checked = part.name === this.props.part ? true : false;
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
    channel.publish('export.part.set', {part: event.target.value});
  },
  setFrame: function(event) {
    channel.publish('export.frame.set', {frame: +event.target.value});
  },
  setAnimation: function(event) {
    channel.publish('export.animation.set', {animation: event.target.value});
  },
});