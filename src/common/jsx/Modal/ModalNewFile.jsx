var ModalNewFile = React.createClass({
  mixins: [ModalBasicMixin],
  render: function() {
    return (
      <div className="dialog">
        <div className="title">New file</div>
        <ul className="text">
          <li>
            <label>Frames:</label>
            <input type="number" ref="framesX" defaultValue="1" min="1" onChange={this.updateSize} />
            x
            <input type="number" ref="framesY" defaultValue="1" min="1" onChange={this.updateSize} />
          </li>
          <li>
            <label>Frame size:</label>
            <input type="number" ref="pixelsX" defaultValue="20" min="1" onChange={this.updateSize} />
            x
            <input type="number" ref="pixelsY" defaultValue="20" min="1" onChange={this.updateSize} />
            px
          </li>
          <li>
            <i ref="size">Image size: 20x20px</i>
          </li>
        </ul>
        <div className="actions">
          <button onClick={this.createFile}>Ok</button>
          <button onClick={this.hide}>Cancel</button>
        </div>
      </div>
    )
  },
  createFile: function() {
    var framesX = this.refs.framesX.getDOMNode().value,
        framesY = this.refs.framesY.getDOMNode().value,
        pixelsX = this.refs.pixelsX.getDOMNode().value,
        pixelsY = this.refs.pixelsY.getDOMNode().value;

    file.create(framesX, framesY, pixelsX, pixelsY);
    this.hide();
  },
  updateSize: function() {
    var framesX = this.refs.framesX.getDOMNode().value,
        framesY = this.refs.framesY.getDOMNode().value,
        pixelsX = this.refs.pixelsX.getDOMNode().value,
        pixelsY = this.refs.pixelsY.getDOMNode().value,
        txt;

    if(framesX*framesY === 1) {
      txt = 'Image size: '+pixelsX+'x'+pixelsY+'px';
    }
    else {
      txt = 'Spritesheet size: '+(pixelsX*framesX)+'x'+(pixelsY*framesY)+'px';
    }

    this.refs.size.getDOMNode().innerHTML = txt;
  },
});