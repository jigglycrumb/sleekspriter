// Flux: done, editor: done
var ExportPartSelection = React.createClass({
  mixins: [FluxMixin],
  render: function() {
    var parts = [
      {name: 'spritesheet', el: 'Spritesheet as single image'},
      {name: 'oneframe', el:  <span>
                                Frame&nbsp;
                                <input type="number" value={this.props.ui.export.frame} min={1} max={this.props.ui.frames.total} onChange={this.setFrame} />
                                &nbsp;/&nbsp;
                                {this.props.ui.frames.total} as image
                              </span>},
      {name: 'allframes', el: 'Every frame as single image'},
    ];

    if(this.props.file.animations.length > 0) {

      var id = this.props.ui.export.animation === null ? this.props.file.animations[0].id : this.props.ui.export.animation,
          animation = storeUtils.animations.getById(id),
          runtime = Math.round(1000/animation.fps * animation.frames.length);

      parts.push({
        name: 'animation',
        el: <span>
              Animation&nbsp;
              <select onChange={this.setAnimation} defaultValue={id}>
                {this.props.file.animations.map(function(animation) {
                  return( <option key={animation.id} value={animation.id}>{animation.name}</option> )
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
            var checked = part.name === this.props.ui.export.part ? true : false;
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
    this.getFlux().actions.exportPart(event.target.value);
  },
  setFrame: function(event) {
    this.getFlux().actions.exportFrame(event.target.value);
  },
  setAnimation: function(event) {
    this.getFlux().actions.exportAnimation(event.target.value);
  },
});