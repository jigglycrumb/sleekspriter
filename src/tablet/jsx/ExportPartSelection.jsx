var ExportPartSelection = React.createClass({
  render: function() {
    var parts = [
      {name: 'spritesheet', el: 'Spritesheet as single image'},
      {name: 'oneframe', el:  <span>
                                Frame&nbsp;
                                <input type="number" value={this.props.frame} min={1} max={this.props.ui.frames.total} onChange={this.setFrame} />
                                &nbsp;/&nbsp;
                                {this.props.ui.frames.total} as image
                              </span>},
    ];

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
    channel.gui.publish('export.part.set', {part: event.target.value});
  },
  setFrame: function(event) {
    channel.gui.publish('export.frame.set', {frame: +event.target.value});
  },
  setAnimation: function(event) {
    channel.gui.publish('export.animation.set', {animation: event.target.value});
  },
});