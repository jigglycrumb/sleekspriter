var ExportOutputSelection = React.createClass({
  render: function() {
    var formats = ['png', 'jpg'];
    if(this.props.part === 'animation') {
      formats = ['gif']; //, 'mov'];
    }

    return (
      <div>
        <h6>Output</h6>
        <ul>
          <li>
            <select onChange={this.setFormatFromSelectbox} value={this.props.format}>
              {formats.map(function(format) {
                return( <option key={format} value={format === 'jpg' ? 'jpeg' : format}>{format}</option> )
              }, this)}
            </select>
          </li>
        </ul>
      </div>
    )
  },
  setFormatFromSelectbox: function(event) {
    this.setFormat(event.target.value);
  },
  setFormat: function(format) {
    channel.gui.publish('export.format.set', {format: format});
  },
});